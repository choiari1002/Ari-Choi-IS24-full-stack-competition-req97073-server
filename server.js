const Data = require("./Data.js");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/data", function (req, res) {
  res.json(Data);
});

app.get('/api/search', (req, res) => {
  const { searchTerm, selectedOption } = req.query;
  let filteredProducts = [];

  if (selectedOption === 'productName') {
    filteredProducts = Data.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } else if (selectedOption === 'scrumMasterName') {
    filteredProducts = Data.filter((product) =>
      product.scrumMasterName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  } else if (selectedOption === 'developerName') {
    filteredProducts = Data.filter((product) => {
      return product.Developers.some((developer) =>
        developer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  } else {
    return res.status(400).send('Invalid selectedOption');
  }

  res.send(filteredProducts);
});


app.post("/api/create", (req, res) => {
  const formData = req.body;

  const newProduct = {
    productId: Data[Data.length - 1].productId + 1,
    productName: formData.productName,
    productOwnerName: formData.productOwnerName,
    Developers: formData.Developers,
    scrumMasterName: formData.scrumMasterName,
    startDate: formData.startDate,
    methodology: formData.methodology,
  };
  console.log(newProduct);
  Data.push(newProduct);
  res.send("Data received");
});

app.put("/api/update/:id", (req, res) => {
  const { productId, ...updatedProduct } = req.body;
  console.log(updatedProduct);

  const productIndex = Data.findIndex((data) => data.productId == productId);
  if (productIndex === -1) {
    res.status(404).send("Product not found");
    return;
  }

  // Data 배열에서 productIndex 에 위치한 객체 업데이트
  Data[productIndex] = {
    ...Data[productIndex],
    ...updatedProduct,
  };

  res.json({ message: "Data updated" });
});

app.delete("/api/delete/:id", (req, res) => {
  const productId = req.params.id;

  const productIndex = Data.findIndex((data) => data.productId == productId);

  if (productIndex != -1) {
    Data.splice(productIndex, 1);
    res.status(200).send("삭제가 완료되었습니다.");
  } else {
    res.status(404).send("해당 아이디를 가진 데이터를 찾을 수 없습니다.");
  }
});

app.listen(8080, function () {
  console.log("listening on 8080");
});
