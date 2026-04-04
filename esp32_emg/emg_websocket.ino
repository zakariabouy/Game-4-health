/*
 * ESP32 EMG Stress Sensor — WebSocket Server
 *
 * WIRING:
 *   EMG Sensor Signal → GPIO 34 (ADC1_CH6, analog input)
 *   EMG Sensor VCC    → 3.3V on ESP32
 *   EMG Sensor GND    → GND on ESP32
 *   9V Battery        → VIN on ESP32 (through voltage regulator if needed)
 *   USB Type-B        → for programming / serial debug
 *
 * HOW IT WORKS:
 *   1. Reads raw EMG value from the sensor (0-4095 on ESP32 ADC)
 *   2. Applies a moving average to smooth the signal
 *   3. Maps it to a stress level 0.0 - 1.0
 *   4. Sends JSON via WebSocket every 100ms: {"stress": 0.45, "raw": 1823}
 *   5. Godot connects to ws://<ESP32_IP>:81
 *
 * SETUP:
 *   1. Install "WebSockets" library by Markus Sattler in Arduino IDE
 *   2. Set your WiFi credentials below
 *   3. Upload to ESP32
 *   4. Open Serial Monitor at 115200 baud to see the IP address
 *   5. Enter that IP in Godot's stress_monitor.gd
 */

#include <WiFi.h>
#include <WebSocketsServer.h>

// ─── CONFIG ───
const char* WIFI_SSID     = "YOUR_WIFI_SSID";      // ← Change this
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // ← Change this
const int   EMG_PIN       = 34;                     // ADC pin for EMG sensor
const int   SEND_INTERVAL = 100;                    // ms between WebSocket sends
const int   SMOOTHING     = 10;                     // moving average window size

// ─── Stress calibration ───
// These define what EMG reading = relaxed vs stressed.
// Calibrate by watching Serial output: relaxed ~200-500, stressed ~1500-3000+
int EMG_BASELINE  = 300;    // typical relaxed reading
int EMG_MAX_STRESS = 2500;  // typical stressed/clenched reading

// ─── State ───
WebSocketsServer webSocket = WebSocketsServer(81);
int readings[10];
int readIndex = 0;
long readTotal = 0;
int smoothedValue = 0;
unsigned long lastSend = 0;
bool clientConnected = false;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected\n", num);
      clientConnected = false;
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %s\n", num, ip.toString().c_str());
        clientConnected = true;
        // Send a welcome message with calibration info
        String welcome = "{\"type\":\"hello\",\"baseline\":";
        welcome += EMG_BASELINE;
        welcome += ",\"max\":";
        welcome += EMG_MAX_STRESS;
        welcome += "}";
        webSocket.sendTXT(num, welcome);
      }
      break;
    case WStype_TEXT:
      {
        // Receive calibration commands from Godot
        String msg = String((char*)payload);
        if (msg.startsWith("CAL_LOW")) {
          EMG_BASELINE = smoothedValue;
          Serial.printf("Calibrated BASELINE to %d\n", EMG_BASELINE);
        } else if (msg.startsWith("CAL_HIGH")) {
          EMG_MAX_STRESS = smoothedValue;
          Serial.printf("Calibrated MAX_STRESS to %d\n", EMG_MAX_STRESS);
        }
      }
      break;
  }
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);  // 0-4095

  // Initialize smoothing array
  for (int i = 0; i < SMOOTHING; i++) {
    readings[i] = 0;
  }

  // Connect WiFi
  Serial.println("\n--- EMG Stress Sensor ---");
  Serial.printf("Connecting to %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("WebSocket server on port 81");
  Serial.println("Connect Godot to: ws://" + WiFi.localIP().toString() + ":81");

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();

  // ── Read and smooth EMG ──
  readTotal -= readings[readIndex];
  readings[readIndex] = analogRead(EMG_PIN);
  readTotal += readings[readIndex];
  readIndex = (readIndex + 1) % SMOOTHING;
  smoothedValue = readTotal / SMOOTHING;

  // ── Send stress data at interval ──
  unsigned long now = millis();
  if (now - lastSend >= SEND_INTERVAL) {
    lastSend = now;

    // Calculate normalized stress (0.0 = relaxed, 1.0 = very stressed)
    float stress = (float)(smoothedValue - EMG_BASELINE) / (float)(EMG_MAX_STRESS - EMG_BASELINE);
    stress = constrain(stress, 0.0, 1.0);

    // Debug to Serial
    Serial.printf("EMG: %d | Smooth: %d | Stress: %.2f\n",
                  readings[(readIndex - 1 + SMOOTHING) % SMOOTHING],
                  smoothedValue, stress);

    // Send to all connected WebSocket clients
    if (clientConnected) {
      String json = "{\"stress\":";
      json += String(stress, 3);
      json += ",\"raw\":";
      json += smoothedValue;
      json += "}";
      webSocket.broadcastTXT(json);
    }
  }
}
