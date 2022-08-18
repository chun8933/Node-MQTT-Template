/* Library */
const mqttConnection = require('mqtt');
const fs = require('fs');
var dgram = require('dgram');

/* Init Config */
var _config = fs.readFileSync("Config.json");
_config = JSON.parse(_config);

var client = dgram.createSocket({ type: 'udp4', reuseAddr: true });

var _mqttCAFile = fs.readFileSync(_config.MQTTCAFilePath);
var _mqttProtocol = "mqtts://";

if(MQTTPort != 8883) {

  _mqttProtocol = "mqtt://";
}

var _env = _config.Env;

var MQTTPort = _config.MQTTPort;
var MQTTQos = _config.MQTTQos;
var MQTTTopic = _config.MQTTTopic;
var MQTTCAFilePath = _config.MQTTCAFilePath;
var MQTTHost = _config.MQTTHost;
var MQTTUsername = _config.MQTTUsername;
var MQTTPassword = _config.MQTTPassword;

var MQTTClient  = mqttConnection.connect(_mqttProtocol + MQTTHost, {

  port: MQTTPort,
  username: MQTTUsername,
  password: MQTTPassword,
  rejectUnauthorized : false, //false for smooth process
  ca:_mqttCAFile
});

/* On Connection */
MQTTClient.on('connect', function () {
    if (MQTTClient.connected) {

        MQTTClient.subscribe(MQTTTopic, {qos: MQTTQos}, function (err, granted) {

            log('Subscribed to topics: ' + JSON.stringify(granted));
        });
    }
    else {

      log('connection error');
    }
});

/* Msg Received */
MQTTClient.on('message', function (topic, message) {

  // Logic goes here
  log(message.toString());
});

function log(msg) {

  var json = JSON.parse("{\"MQTT\":{}}");
  json.MQTT = msg;
  json = JSON.stringify(json);

  if(_env == _config.Env) {

    console.log(json);
  }
  client.send(json, 0, json.length, 9991, "127.0.0.1");
}
