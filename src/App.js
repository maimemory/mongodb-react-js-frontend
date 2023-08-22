import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, Form, Container, Row, Col } from 'react-bootstrap';

function App() {
  const [memoList, setMemoList] = useState([]);
  const [detail, setDetail] = useState('');

  useEffect(() => {
    axios.get('https://mongodb-react-js-backend.onrender.com/read')
    .then(res => {
      console.log(res.data);
      setMemoList(res.data);
    })
  }, [])

  const showMemoList = memoList.map(memo => {

    const deleteMemo = (date) => {
      axios.delete(`https://mongodb-react-js-backend.onrender.com/delete/${memo.date}`)
      .then(res => {
        console.log(res.data);
        setMemoList(memoList.filter(memo => {
          return memo.date != date;
        }))
      })
    }
    
    return(
      <div key={memo.date}>
        <Row>
          <Col md={11} sm={10} xs={9}>
            <ListGroup.Item variant="success" action>{memo.detail} - {memo.writer} | {memo.date}</ListGroup.Item>
          </Col>
          <Col md={1} sm={2} xs={3}>
            <Button variant="danger" onClick={() => deleteMemo(memo.date)}>Delete</Button>
          </Col>
        </Row>
      </div>
    )
  })

  const handleOnChange = (e) => {
    setDetail(e.target.value);
  }

  const createMemo = () => {

    if(detail != ''){
      const newMemo = {
        detail: detail,
        writer: 'FFXVI',
        date: Date()
      }
  
      axios.post('https://mongodb-react-js-backend.onrender.com/create', newMemo)
      .then(res => {
        console.log(res.data);
        setMemoList([...memoList, newMemo]);
        // memoList.push(newMemo);
      })
  
      setDetail('');
    }
  }
  
  return (
    <div className="App">
      <Container>
        <ListGroup>
          {showMemoList}
        </ListGroup>
        <br/>
        <Row>
          <Col md={11} sm={10} xs={9}>
            <Form.Control onChange={handleOnChange} value={detail}/>
          </Col>
          <Col md={1} sm={2} xs={3}>
            <Button variant="primary" onClick={createMemo}>Send</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
