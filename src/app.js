const request = require('request')
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'weather app',
        name: 'Wafaa'
    })
})

app.get('/about', (req,res) =>{
    res.render('about', {
        title: 'About me',
        name: 'Wafaa'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        message: 'contact for help',
        title: 'help',
        name: 'Wafaa'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'you must provide an address'
        })
    }

    geocode( req.query.address , (error, {longtitude, latitude, location} = { }) => {
        if(error){
          return res.send({error})
        }
    
        forecast(latitude, longtitude, (error, forecastData) => {
          if(error){
            return res.send({error})
          }
    
          res.send({
            forecast: forecastData,
            location,
            address: req.query.address
    
        })
        })
      
    })

    
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Wafaa',
        message: 'help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        message: 'page not found',
        title: '404',
        name: 'Wafaa'
    })
})




app.listen(3000, () => {
    console.log('server is up on port 3000!')
})