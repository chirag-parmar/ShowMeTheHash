#include <ArduinoJson.h>
#include "RestClient.h"

//setup REST API client and response string 
RestClient client = RestClient("showmethehash.herokuapp.com");
String response;

//Intitalize JSON buffer
StaticJsonDocument<1000> doc;

// assign pin for every event
const int started = 16;
const int unsealed = 5;
const int finalized = 4;
const int transferred = 0;
const int released = 2;

//Setup
void setup() {

  //Begin Serial Communication at 9600 baud
  Serial.begin(9600);

  //WiFi Setup
  Serial.println("connect to WiFi network");
  client.begin("ssid", "password");
  Serial.println("Setup!");

  //setup event pins as OUTPUT
  pinMode(started, OUTPUT);
  pinMode(unsealed, OUTPUT);
  pinMode(finalized, OUTPUT);
  pinMode(transferred, OUTPUT);
  pinMode(released, OUTPUT);
}

void loop(){
  digitalWrite(started, LOW);
  digitalWrite(unsealed, LOW);
  digitalWrite(finalized, LOW);
  digitalWrite(transferred, LOW);
  digitalWrite(released, LOW);

  response = "";
  int statusCode = client.get("/monitor", &response);
  if(statusCode == 200){
    /* Parse the JSON time */
    DeserializationError error = deserializeJson(doc, response);
  
    // Test if parsing succeeds.
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return;
    }
  
    // Get the root object in the document
    JsonObject& root = doc.as<JsonObject>();
    if(root["events"]["started"] == "true"){
      digitalWrite(started,HIGH);
    }
    if(root["events"]["finalized"] == "true"){
      digitalWrite(finalized,HIGH);
    }
    if(root["events"]["transferred"] == "true"){
      digitalWrite(transferred,HIGH);
    }
    if(root["events"]["released"] == "true"){
      digitalWrite(released,HIGH);
    }
    JsonObject& unsealInfo = root["events"]["revealedBids"][0];
    String from = unsealInfo["from"];
    if(from.length() > 0){
      digitalWrite(unsealed, HIGH);
    }
  }

  delay(3000);
}
