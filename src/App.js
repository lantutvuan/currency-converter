import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './components/CurrencyRow';

const BASE_URL = "https://api.exchangerate.host/latest";
const axios = require('axios');

function App() {
  
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState(0)
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = (amount * exchangeRate).toFixed(2)
  } else {
    toAmount = amount
    fromAmount = (amount / exchangeRate).toFixed(2)
  }

  useEffect(() => {
    axios.get(BASE_URL)
      .then(function (result) {
        const firstElement = Object.keys(result.data.rates)[0];
        setCurrencyOptions([...Object.keys(result.data.rates)])
        setFromCurrency(result.data.base)
        setToCurrency(firstElement)
        setExchangeRate(result.data.rates[firstElement])
      })
      .catch(function (error) {
        console.log(error);
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      axios.get(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(function (result)  {
          setExchangeRate(result.data.rates[toCurrency])
        })
        .catch(function (error){
          console.log(error);
        })
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
