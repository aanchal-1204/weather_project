import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';
import cloudIcon from '../assets/cloud.png';
import clearIcon from '../assets/clear.png';
import windIcon from '../assets/wind.png';
import humidityIcon from '../assets/humidity.png';
import drizzleIcon from '../assets/drizzle.png';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [city,setCity]=useState("")

  const allIcons = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": cloudIcon,
    "03n": cloudIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const searchCity = async (city) => {
    if (!city) {
      alert("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert("City not found. Please try again.");
        setWeatherData(null);
        setCity("");
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clearIcon;
      setWeatherData({
        location: data.name,
        temperature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: icon,
      });
      setCity("");
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong while fetching data. Please try again.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCity("New York"); // Default city
  }, []);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input type="text" value={city} placeholder='Search for a city...' ref={inputRef} onChange={(e)=>setCity(e.target.value)}/>
        <img src={searchIcon} alt="Search" onClick={() => searchCity(inputRef.current.value)} />
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : weatherData ? (
        <>
          <img src={weatherData.icon} className='weather-icon' alt="Weather Icon" />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className='weather-details'>
            <div className='col'>
              <img src={humidityIcon} alt="Humidity" />
              <div className='col-details'>
                <p>{weatherData.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className='col'>
              <img src={windIcon} alt="Wind Speed" />
              <div className='col-details'>
                <p>{weatherData.windSpeed} km/hr</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Please search for a city to view the weather.</p>
      )}
    </div>
  );
}

export default Weather;
