import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Item from "../../components/Item";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { addToCart } from "../../state";
import { useDispatch } from "react-redux";
import { tokens } from "../../theme2";

const ItemDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mobilePoint = useMediaQuery("(max-width:749px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  // console.log("items", item);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItem() {
    const item = await fetch(

      `https://strapi-production-c72c.up.railway.app/api/watch-items/${itemId}`,
      {
        method: "GET",
      }
    );
    const itemJson = await item.json();
    setItem(itemJson.data);
  }

  async function getItems() {
    const items = await fetch(
      "https://strapi-production-c72c.up.railway.app/api/watch-items",
      { method: "GET" }
    );
    const itemsJson = await items.json();

    dispatch(setItems(itemsJson.data));
  }


  useEffect(() => {
    getItem();
    getItems();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width="80%" m="120px auto 80px">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        {/* IMAGES */}
        <Box
          flex="1 1 40%"
          mb="40px"
          backgroundColor={colors.primary[300]}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            alt={item?.attributes?.name}
            width="80%"
            height="80%"
            src={item?.attributes?.url}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* ACTIONS */}
        <Box
          flex="1 1 50%"
          mb="40px"
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
        >
          <Box
            display="flex"
            gap="5px"
            alignItems="center"
            onClick={() => navigate(`/frontend-watch-ecommerce/`)}
            cursor="pointer"
          >
            <IconButton
              sx={{
                width: "0px",
                height: "0px",
                "&:hover": { background: "none", transform: "translateX(-5px)", },
                fontSize: "20px",
                transition: ".3s"
              }}
            >
              <i className='bx bx-arrow-back'></i>
            </IconButton>
            <Typography
              sx={{
                cursor: "pointer",
                justifyContent: "center"
              }}
              variant="h5">Home</Typography>
          </Box>
          <Box m="0px 0 5px 0">
            <Typography mb="5px">CATEGORIES: ({item?.attributes?.category})</Typography>
            <Typography mb="4px" variant="h2">{item?.attributes?.name}</Typography>
            <Typography variant="h5" fontWeight="600">#{item?.attributes?.price}</Typography>
            <Typography sx={{ mt: "20px" }}>
              {item?.attributes?.longDesc}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              // border={`1.5px solid ${shades.neutral[300]}`}
              mr="20px"
              p="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 0))}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: "0 5px" }}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              sx={{
                backgroundColor: "#222222",
                color: "white",
                borderRadius: 0,
                minWidth: "150px",
                padding: "10px 40px",
              }}
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
            >
              ADD TO CART
            </Button>
          </Box>
        </Box>
      </Box>

      {/* INFORMATION */}
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="DESCRIPTION" value="description" />
          <Tab label="REVIEWS" value="reviews" />
        </Tabs>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="15px">
        {value === "description" && (
          <Box
          >{item?.attributes?.description}</Box>
        )}
        {value === "reviews" && (
          <Box
          >{item?.attributes?.reviews}</Box>
        )}
      </Box>

      {/* RELATED ITEMS */}
      <Box
        mt="50px" width="100%">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign={mobilePoint ? "center" : "start"}
        >
          Related Products
        </Typography>
        <Box
          mt="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1.33%"
          justifyContent={mobilePoint ? "center" : "space-between"}
        >
          {items.slice(0, 4).map((item, i) => (
            <Item key={`${item.name}-${i}`} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
