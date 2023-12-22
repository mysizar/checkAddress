import { useState, useEffect } from "react";
import "./index.css";
import Input from "./components/input/input";

function App() {
  const [plzList, setPlzList] = useState([]);
  const [streetList, setStreetList] = useState([]);
  const [housesList, setHousesList] = useState([]);

  const [plz, setPlz] = useState("0000000000");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  const [addressPair, setAddressPair] = useState([]);

  useEffect(() => {
    fetch("./plz.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const arr = data.map((i) => i.Plz + " " + i.Ort);
        setPlzList(arr);
      });
  }, []);

  useEffect(() => {
    const fetchStreet = async () => {
      let code = plz.split(" ")[0];
      try {
        const response = await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            body:
              "data=" +
              encodeURIComponent(`
            [out:json];
            nwr["addr:postcode"=${code}];
            out geom;
            `),
          }
        );
        const data = await response.json();
        console.log(data);

        let streets = data.elements.map((i) => i.tags["addr:street"]);
        streets = streets.filter(
          (el, i, arr) => el !== undefined && arr.indexOf(el) === i
        ); // return only unique items
        setStreetList(streets);
        console.log("streetList", streets);

        const nums = data.elements.map((i) => {
          return {
            num: i.tags["addr:housenumber"],
            str: i.tags["addr:street"],
          };
        });
        // console.log("address", nums);
        setAddressPair(nums);
      } catch (error) {
        console.log(error);
      }
    };
    // console.log(("new plz:", plz));
    fetchStreet();
  }, [plz]);

  useEffect(() => {
    let nums = addressPair.map((i) => {
      if (i.str === street) return i.num;
    });

    nums = nums.filter(
      (el, i, arr) => el !== undefined && arr.indexOf(el) === i
    ); // return only unique items
    setHousesList(nums);
    // console.log(street);
    // console.log("numbers", nums);
  }, [street, plz]);

  return (
    <div className="app-background">
      <div className="main-container">
        <Input list={plzList} setter={setPlz} ph="PLZ" />
        <Input list={streetList} setter={setStreet} ph="Straße" />
        <Input list={housesList} setter={setHouseNumber} ph="Hausnr." />
        <iframe
          src={`https://maps.google.com/maps?hl=en&q=${
            street + " " + houseNumber + ", " + plz
          }&t=&ie=UTF8&iwloc=B&output=embed`}
        ></iframe>
      </div>
    </div>
  );
}

export default App;
