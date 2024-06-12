import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardMedia, CardContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const App = () => {
  const [latestPrice, setLatestPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    fetchLatestPrice();
    fetchPriceHistory();


    const interval = setInterval(() => {
      fetchLatestPrice();
    }, 120000);


    return () => clearInterval(interval);
  }, []);


  const fetchLatestPrice = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_latest_price');
      setLatestPrice(response.data);
    } catch (error) {
      console.error('Error fetching latest price:', error);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/export_prices_csv');
      // Convert CSV data to array of arrays
      const csvData = response.data.split('\n').map(row => row.split(','));
      // Remove header row
      csvData.shift();
      setPriceHistory(csvData);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };


  const downloadPriceHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/export_prices_csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'price_history.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading price history:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card>
      <CardMedia
          component="img"
          height="300"
          image="product-image.jpg"
          alt="Product"
          sx={{ objectFit: 'fill' }}
        />
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
          Rockerz 550 FM
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Wireless Headphone with 50mm dynamic drivers" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Bluetooth v5.0" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3500mAh battery" />
            </ListItem>
            <ListItem>
              <ListItemText primary="20H Playback" />
            </ListItem>
          
          </List>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Latest Price:
          </Typography>
          {latestPrice && (
            <Typography variant="h6" color="text.primary" gutterBottom>
              {latestPrice.price}
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Timestamp:
          </Typography>
          {latestPrice && (
            <Typography variant="body2" color="text.primary">
              {latestPrice.timestamp}
            </Typography>
          )}
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={downloadPriceHistory}>
            Download Price History
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default App;
