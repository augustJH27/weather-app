import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Fetch user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Fetch weather data based on user's current location
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`)
          .then((response) => {
            setData(response.data);
            console.log(response.data);
            // Set background image based on weather conditions
            setBackgroundImage(getBackgroundImage(response.data));
          })
          .catch((error) => {
            console.error('Error fetching weather data:', error);
          });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );

    // Update current date and time
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentDateTime(currentDate.toLocaleDateString('en-US', options));
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval
  }, []); // Empty dependency array to ensure effect runs only once on component mount

  const getBackgroundImage = (weatherData) => {
    // Customize this function to set background image based on weather conditions
    // For demonstration, let's set a default background image
    return 'url(default-background.jpg)';
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
          // Set background image based on weather conditions
          setBackgroundImage(getBackgroundImage(response.data));
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
      setLocation('');
    }
  };

  return (
    <div className="app" style={{ backgroundImage }}>
      <div className="search">
        <div className="input-container">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder="Enter Location"
            type="text"
          />
        </div>
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p className="p-location">{data.name}</p>
            <p className="datetime">{currentDateTime}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{(data.main.temp).toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              <p>Feels Like</p>
              {data.main ? (
                <p className="bold">{(data.main.feels_like).toFixed()}°C</p>
              ) : null}
            </div>
            <div className="humidity">
              <p>Humidity</p>
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
            </div>
            <div className="wind">
              <p>Wind Speed</p>
              {data.wind ? (
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;