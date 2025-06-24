import axios from 'axios';
import geoip from 'geoip-lite';

export const getLocationFromIP = async (ip) => {
  try {
    // First try with geoip-lite (free, offline)
    const geoData = geoip.lookup(ip);
    
    if (geoData) {
      return {
        country: geoData.country,
        city: geoData.city,
        region: geoData.region,
        timezone: geoData.timezone
      };
    }

    // Fallback to external API if available
    if (process.env.IPINFO_TOKEN) {
      return await getLocationFromIPInfo(ip);
    }

    if (process.env.IPDATA_API_KEY) {
      return await getLocationFromIPData(ip);
    }

    return null;
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return null;
  }
};

const getLocationFromIPInfo = async (ip) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}`, {
      headers: {
        'Authorization': `Bearer ${process.env.IPINFO_TOKEN}`
      },
      timeout: 5000
    });

    const data = response.data;
    
    return {
      country: data.country,
      city: data.city,
      region: data.region,
      timezone: data.timezone
    };
  } catch (error) {
    console.error('IPInfo API error:', error);
    return null;
  }
};

const getLocationFromIPData = async (ip) => {
  try {
    const response = await axios.get(`https://api.ipdata.co/${ip}`, {
      params: {
        'api-key': process.env.IPDATA_API_KEY
      },
      timeout: 5000
    });

    const data = response.data;
    
    return {
      country: data.country_code,
      city: data.city,
      region: data.region,
      timezone: data.time_zone?.name
    };
  } catch (error) {
    console.error('IPData API error:', error);
    return null;
  }
};