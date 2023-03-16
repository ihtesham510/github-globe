## Dependencies
- three
- three-globe

## Usage
```bash
npm i
npm run dev
```

## Adding cities
just add your city info in `assets/map.json`
```js
    {
      "text": "/*  Add your text here  */",
      "size": 1.0,
      "country": "/*  Add your country name here*/",
      "city": "/*  Add your city name here  */",
      "lat": "/* latitue quardinates */",
      "lng": "/*  longitute quardinates */"
    },
```
## Adding your own flights or lines
add your cities info in the `/assets/lines.json`
the lines are executed in an order if you want a line or flight to go from one city to another and from that to another you must change the order from 1 to 2.

i've changed set different colors on different status if the `status` is `true` then the color will be green and if the `status` is `false`. 
you can also change it in the main.js file 
```js
.arcColor((e) => {
    return e.status ? colors.green : colors.red
})
```
```js
{
      "type": "pull",
      "status": true,
      "order": /* the order in which the line or flight will execute itself */,
      "from": "/* from your destination */",
      "to": "/* To your destination */",
      "startLat": "/* first city latitue quardinates */",
      "startLng": "/* first city longitute quardinates */",
      "endLat": "/* second city latitue quardinates */",
      "endLng": "/* second city longitute quardinates */",
      "arcAlt": 0.5
}
```
- exmaple :
```js
{
      "type": "pull",
      "status": false,
      "order": 1,
      "from": "Dubai",
      "to": "New York",
      "startLat": "25.117384",
      "startLng": "55.132645",
      "endLat": "40.713318",
      "endLng": "-73.998978",
      "arcAlt": 0.5
}
```

