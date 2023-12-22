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
    fetch("./plz2.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const arr = data.map((i) => i.Plz + " " + i.Ort);
        setPlzList(arr);
      });
  }, []);

  useEffect(() => {
    const fetchStreet = async () => {
      try {
        // let page = 1;
        let code = plz.split(" ")[0];
        // let fullList = [];
        // do {
        //   // const response = await fetch(
        //   //   `https://openplzapi.org/de/Streets?postalCode=${code}&page=${page}&pageSize=50`
        //   // );
        //   const streets = await response.json();
        //   if (streets.length === 0) break;
        //   fullList = fullList.concat(streets);
        //   page++;
        // } while (true);
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
        console.log("adress", nums);
        setAddressPair(nums);

        // console.log(fullList);
        // const arr = fullList.map((i) => i.name);
        // setStreetList(arr);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(("new plz:", plz));
    fetchStreet();
  }, [plz]);

  useEffect(() => {
    // async function queryOverpass() {
    //   try {
    //     const response = await fetch(
    //       "https://overpass-api.de/api/interpreter",
    //       {
    //         method: "POST",
    //         /* The body contains the query */
    //         body:
    //           "data=" +
    //           encodeURIComponent(`
    //         [out:json];

    //         nwr["addr:city"="${plz.split(" ")[1]}"]["addr:street"="${
    //             street.split(" ")[0]
    //           }"];
    //         for(t["addr:housenumber"]) {
    //           make stat housenumber=_.val;
    //           out;
    //         }
    //         `),
    //       } //nwr["addr:city"="Neu-Isenburg"]["addr:street"="Berliner Straße"]({{bbox}});
    //     );
    //     const data = await response.json();
    //     console.log(data);
    //     const arr = data.elements.map((i) => i.tags.housenumber);
    //     setHousesList(arr);
    //     console.log(("new street:", street));
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    // queryOverpass();
    console.log(street);

    let nums = addressPair.map((i) => {
      if (i.str === street) return i.num;
    });

    nums = nums.filter(
      (el, i, arr) => el !== undefined && arr.indexOf(el) === i
    ); // return only unique items
    console.log("numbers", nums);
    setHousesList(nums);
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
