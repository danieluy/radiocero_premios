# Radiocero Premios
## Aplicación de gestión de premios a la audiencia.
### Radiocero 104.3 FM, Montevideo, Uruguay



#### First boot
##### 1. Add a "config.json" file to the app folder
```javascript
{
  "misc":{
    "appName": "Radiocero Premios",
    "appDescription": "Aplicación de gestión de premios a la audiencia",
    "version": "0.0.0"
  },
  "session":{
    "secret": "SECRET",
    "durationHours": 4,
    "activeDurationHours": 0.25
  },
  "network":{
    "ip": null,
    "port": null
  },
  "database":
  {
    "ip": null,
    "port": null,
    "name": null,
    "password": null
  }
}
```
##### 2. Create the administrator account
###### In the terminal or command prompt navigate to the app folder and run:
```
$ node app.js admin create -p yourpassword
```