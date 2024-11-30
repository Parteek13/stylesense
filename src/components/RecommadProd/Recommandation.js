import React, { useState } from "react";
import { Box, makeStyles, Typography, Button } from "@material-ui/core";
import { Row } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ProductCard from "../Product/ProductCard";

// Custom styled input for file upload
const Input = styled("input")({
  display: "none",
});

// Material UI styles
const useStyles = makeStyles({
  rec: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30px",
    padding: "0 40px",
  },
  inp: {
    display: "flex",
    flexDirection: "row",
  },
  recImage: {
    width: "350px",
    height: "350px",
    objectFit: "contain",
    marginTop: "40px",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15px",
  },
  txt: {
    marginTop: "40px",
    fontSize: "30px",
    fontWeight: "bold",
  },
});

// Function for sending POST request to the API
const POST = async (path, data) => {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const Recommandation = () => {
  const classes = useStyles();
  
  // States
  const [img, setImg] = useState(null);
  const [prodData, setProdData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sending image data to the API and fetch similar products
  const givReco = async () => {
    setLoading(true);
    const data = await POST("/imageData", { data: img });
    if (data) {
      setProdData(data);
    } else {
      setProdData([]);
    }
    setLoading(false);
  };

  // Function for reading uploaded image
  const imageHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Typography
        align="center"
        variant="h4"
        style={{ marginTop: "40px", fontWeight: "bold" }}
      >
        Get Recommendation
      </Typography>

      <Box className={classes.rec}>
        <Box className={classes.inp}>
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={imageHandler}
            />
            <Button variant="contained" component="span" color="primary">
              Upload
            </Button>
          </label>
          <label htmlFor="icon-button-file">
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={imageHandler}
            />
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        {/* Display uploaded image and recommendation button */}
        {img && (
          <>
            <img src={img} alt="Uploaded" className={classes.recImage} />
            <Box className={classes.products}>
              <Button
                variant="contained"
                color="primary"
                onClick={givReco}
                className={classes.btn}
              >
                Get Recommendation
              </Button>

              {/* Displaying the loading state and product data */}
              {loading ? (
                <Typography variant="h6" align="center">
                  Loading...
                </Typography>
              ) : (
                prodData.length > 0 && (
                  <>
                    <Typography className={classes.txt}>
                      Products For You
                    </Typography>

                    {/* Product card display */}
                    <Box className="container" style={{ marginTop: "20px", marginBottom: "30px" }}>
                      <Row xs={1} md={2} className="g-4">
                        {prodData.map((item) => (
                          <ProductCard
                            id={item.product_id}
                            key={item.product_id}
                            url={item.img1}
                            title={item.title}
                            pTitle={item.title}
                            type={item.product_type}
                            price={item.variant_price}
                            aPrice={item.variant_compare_at_price}
                          />
                        ))}
                      </Row>
                    </Box>
                  </>
                )
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Recommandation;
