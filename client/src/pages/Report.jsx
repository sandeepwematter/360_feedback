import { Accordion, Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
// import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Filter from '../components/Filter';
import BiggestTable from '../components/BiggestTable';
import SmallestTable from '../components/SmallestTable';
import Tables from '../components/Tables'

const Report = () => {

  const [type, setType] = useState("");
  const [typeDropdown, setTypeDropdown] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [demographicValue, setDemographicValue] = useState([]);
  const [filterObject, setFilterObject] = useState({});
  const [respondantRole, setRespondantRole] = useState([])
  const [competValue, setCompetValue] = useState([]);
  const [num, setNum] = useState("");
  const [allCompetencyValue, setAllCompetencyValue] = useState([]);
  const [allData, setAllData] = useState({});
  const [definationArray, setDefinationArray] = useState([]);
  const [parameterValue, setParameterValue] = useState([]);
  const [response, setResponse] = useState([]);
  const [dataValue, setDataValue] = useState([]);

  const handleChangeReset = (e) => {
    const arrayKeys = Object.keys(filterObject).filter(key => Array.isArray(filterObject[key]));
    const updatedOne = {};
    arrayKeys.map((val) => {
      const updatedChecked = filterObject[val].map((user) => ({
        ...user, isChecked: false,
      }));
      updatedOne[val] = updatedChecked;
    })
    setFilterObject(updatedOne);
  }

  const handleChangeApply = async () => {
    let selectedFilters = {};
    for (const key of Object.keys(filterObject)) {
      selectedFilters[key] = filterObject[key]
        .filter((user) => user.isChecked)
        .map((user) => user.name);
    }
    try {
      const data = await axios.get(`http://localhost:8010/alldata`);
      const dataLength = data.data.length;
      const cnt = Array(dataLength).fill(0);
      let flag = 0, val = 0, count = 0;
      for (let i = 0; i < demographicValue.length; i++) {
        let str = '_' + demographicValue[i];
        for (let j = 0; j < dataLength; j++) {
          const dataLocation = data?.data[j][str];
          if (selectedFilters[demographicValue[i]].includes(dataLocation)) {
            cnt[j]++;
            flag = 1;
          }
        }
        if (flag === 1) val++;
        flag = 0;
      }
      const AllData = [];
      for (let i = 0; i < dataLength; i++) {
        if (cnt[i] === val) {
          AllData.push(data.data[i]);
        }
      }
      setAllData({ data: AllData });
      for (let i = 0; i < dataLength; i++) {
        if (val === 0) {
          count = 0;
          break;
        }
        if (cnt[i] === val) count++;
      }
      setRespondantRole(count);
    } catch (err) {
      console.log(err);
    }
  }
  // fetchDataForEachCompetencyAndValue function --> for each competency and value
  const fetchDataForEachCompetencyAndValue = async () => {
    try {
      let data = {};
      if (Object.keys(allData).length !== 0) {
        data = allData;
      }
      else {
        data = await axios.get(`http://localhost:8010/alldata`);
      }
      const response = await axios.get(`http://localhost:8010/competvalues`);

      const ArrayForQuestioncode = {};
      const ArrayForThemecode = {};
      for (const data of response.data) {
        const { questioncode, driver, description, themecode, theme } = data;
        if (!ArrayForQuestioncode[questioncode]) {
          ArrayForQuestioncode[questioncode] = [];
        }
        ArrayForQuestioncode[questioncode].push({ driver, description });
        if (!ArrayForThemecode[themecode]) {
          ArrayForThemecode[themecode] = [];
        }
        ArrayForThemecode[themecode].push({ theme });
      }
      for (const questioncode in ArrayForQuestioncode) {
        ArrayForQuestioncode[questioncode] = ArrayForQuestioncode[questioncode];
      }
      for (const themecode in ArrayForThemecode) {
        ArrayForThemecode[themecode] = ArrayForThemecode[themecode];
      }

      const distinctKeyValuePairs = data.data.reduce((acc, item) => {
        Object.entries(item).forEach(([key, value]) => {
          if (!acc[key] || !acc[key].includes(value)) {
            acc[key] = acc[key] || [];
            acc[key].push(value);
          }
        });
        return acc;
      }, {});
      const uniqueObject = Object.fromEntries(
        Object.entries(distinctKeyValuePairs)
          .filter(([key]) => !['_id', '__v'].includes(key) && key.startsWith('_'))
          .map(([key, value]) => [key.replace(/_/g, ''), value])
      );

      const cur = data?.data[0]
      const AllKeys = Object.keys(cur)
      // temp1 ->  here key stored which start from '_'
      const temp1 = AllKeys.filter(user => user !== "_id" && user !== "__v" && user[0] === '_');
      const modifiedTemp1 = temp1.map((str) => {
        return str.substring(1);
      });
      const TypeDropdown = AllKeys.filter(user => user.slice(0, -5).toLowerCase() === "competency" || user.slice(0, -5).toLowerCase() === "value");
      const uniqueStrings = new Set();
      const TypeDropdownModified = TypeDropdown.map(str => {
        const modifiedString = str.substring(0, str.length - 3);
        if (!uniqueStrings.has(modifiedString)) {
          uniqueStrings.add(modifiedString);
          return modifiedString;
        }
      }).filter(str => str !== undefined);
      const arrayForTypeDropDown = TypeDropdownModified.map(type => ArrayForThemecode[type][0].theme[0]);
      const uniqueCompetencyAndValue = TypeDropdownModified.map(type => TypeDropdown.filter(str => str.slice(0, -3) === type));
      const countOfEacCompetencyAndValueQuestion = TypeDropdownModified.map(type => {
        const cnt = TypeDropdown.filter(str => str.slice(0, -3) === type).length;
        return { name: type, len: cnt };
      });
      setTypeDropdown(arrayForTypeDropDown);

      let totalFeedbacks = data.data.length;
      let len = Object.keys(uniqueObject).length;
      let m = 0;
      for (let l = 0; l < len; l++) {
        let str = "";
        if (demographics === modifiedTemp1[l]) {
          for (let t = 0; t < arrayForTypeDropDown.length; t++) {
            let Num = countOfEacCompetencyAndValueQuestion[t].len;
            let dropdownOption = arrayForTypeDropDown[t];
            if (dropdownOption === type) {
              const ParameterValue = uniqueObject[demographics];
              ParameterValue.push("Total")
              setParameterValue([...ParameterValue]);
              m = ParameterValue.length;
              const peopleArrayCompt = new Array(m - 1);
              const peopleCountCompt = new Array(m - 1);
              for (let i = 0; i < m - 1; i++) {
                peopleArrayCompt[i] = new Array(countOfEacCompetencyAndValueQuestion[t].len).fill(0);
                peopleCountCompt[i] = new Array(countOfEacCompetencyAndValueQuestion[t].len).fill(0);
              }
              for (let i = 0; i < totalFeedbacks; i++) {
                let prop = '_' + demographics;
                str = data.data[i][prop];
                for (let k = 0; k < m - 1; k++) {
                  if (str === ParameterValue[k]) {
                    for (let j = 0; j < countOfEacCompetencyAndValueQuestion[t].len; j++) {
                      let zzz = uniqueCompetencyAndValue[t][j];
                      if (data?.data[i][zzz]) {
                        peopleCountCompt[k][j]++;
                        peopleArrayCompt[k][j] += Number(data?.data[i][zzz]);
                      }
                    }
                  }
                }
              }
              for (let i = 0; i < m - 1; i++) {
                for (let j = 0; j < peopleArrayCompt[i].length; j++) {
                  peopleArrayCompt[i][j] /= peopleCountCompt[i][j];
                }
              }
              const maxValues = peopleCountCompt.map(row => Math.max(...row));
              let xx = 0;
              for (let i = 0; i < maxValues.length; i++) {
                xx += maxValues[i];
              }
              maxValues.push(xx)
              setResponse([...maxValues]);
              // Adding one column for Total
              let competency1 = new Array(m - 1);
              for (let i = 0; i < m - 1; i++) {
                competency1[i] = new Array(countOfEacCompetencyAndValueQuestion[t].len + 1).fill(0);
              }
              for (let p = 0; p < m - 1; p++) {
                let k = 0;
                let calculatedValue = 0;
                for (let i = 0; i < competency1[p].length; i++) {
                  if ((i % (competency1[p].length)) === (competency1[p].length - 1)) {
                    competency1[p][i] = (calculatedValue / (competency1[p].length - 1))
                    calculatedValue = 0;
                    continue;
                  }
                  competency1[p][i] = peopleArrayCompt[p][k];
                  calculatedValue += competency1[p][i];
                  k++;
                }
              }
              // Adding one Row for Total
              let competency3 = new Array(m);
              for (let i = 0; i < m; i++) {
                competency3[i] = new Array(countOfEacCompetencyAndValueQuestion[t].len + 1).fill(0);
              }
              let dummyarray = new Array(competency3[0].length).fill(0);
              for (let i = 0; i < competency3.length; i++) {
                for (let j = 0; j < competency3[i].length; j++) {
                  if (i === competency3.length - 1) {
                    competency3[i][j] = dummyarray[j] / (competency3.length - 1);
                  }
                  else {
                    competency3[i][j] = competency1[i][j];
                    dummyarray[j] += competency3[i][j];
                  }
                }
              }
              setDataValue([...competency3]);
              let arrayForDefination = [];
              let realcopmetencyvalue = [];
              for (let i = 0; i < competency3[0].length - 1; i++) {
                let pp = uniqueCompetencyAndValue[t][i]
                let zz = ArrayForQuestioncode[pp][0].driver[0];
                realcopmetencyvalue.push(zz)
                arrayForDefination.push({ name: realcopmetencyvalue[i], defination: ArrayForQuestioncode[pp][0].description[0] })
              }
              setAllCompetencyValue([...realcopmetencyvalue]);
              setDefinationArray([...arrayForDefination])
              const competency2 = [];
              for (let b = 0; b < competency3.length - 1; b++) {
                for (let r = 0; r < competency3[b].length - 1; r++) {
                  competency2.push(parseFloat(competency3[b][r]).toFixed(2));
                }
              }
              function sortWithIndexAndPrint(competency2) {
                return competency2
                  .map((element, index) => ({ element, index }))
                  .sort((a, b) => a.element - b.element)
                  .map(({ element, index }) => `Original index: ${index} Element: ${element}`)
                  .join("\n");
              }
              const sortedCompet = sortWithIndexAndPrint(competency2);
              const lines = sortedCompet.split("\n");
              const big_small_value = [];
              let index = [];
              if (lines.length === 1) {
                index = [lines[0], lines[0]];
              }
              else if (lines.length === 2) {
                index = [lines[0], lines[1], lines[1], lines[0]];
              }
              else {
                index = [lines[0], lines[1], lines[2], lines[competency2.length - 1], lines[competency2.length - 2], lines[competency2.length - 3]];
              }
              let y = 0;
              let z = 0;
              for (let i = 0; i < index.length; i++) {
                if (i < index.length / 2) {
                  const [indexString, elementString] = index[i].split(" Element: ");
                  big_small_value[y + 6] = Number(indexString.split(" ").pop(), 10);
                  big_small_value[y + 7] = Number(parseFloat(elementString, 10).toFixed(2));
                  y += 2;
                }
                else {
                  const [indexString, elementString] = index[i].split(" Element: ");
                  big_small_value[z] = Number(indexString.split(" ").pop(), 10);
                  big_small_value[z + 1] = Number(parseFloat(elementString, 10).toFixed(2));
                  z += 2;
                }
              }
              setNum(Num);
              setCompetValue([...big_small_value]);
            }
          }
        }
      }
      setDemographicValue([...modifiedTemp1]);
      setRespondantRole(totalFeedbacks);
    } catch (err) {
      console.error(err);
    }
  };
  // fetchDataForAllCompetency function --> for all competency in single heatmap  and all value in another heatmap
  const fetchDataForAllCompetency = async () => {
    try {
      let data = {};
      if (Object.keys(allData).length !== 0) {
        data = allData;
      }
      else {
        data = await axios.get(`http://localhost:8010/alldata`);
      }
      const response = await axios.get(`http://localhost:8010/competvalues`);

      let ArrayForThemecode = {};
      for (let i = 0; i < response.data.length; i++) {
        const { themecode, theme, statement } = response.data[i];
        if (!ArrayForThemecode[themecode]) {
          ArrayForThemecode[themecode] = new Set();
        }
        ArrayForThemecode[themecode].add(JSON.stringify({ theme, statement }));
      }
      for (const themecode in ArrayForThemecode) {
        ArrayForThemecode[themecode] = Array.from(ArrayForThemecode[themecode], item => JSON.parse(item));
      }
      let distinctKeyValuePairs = {};
      data.data.map(item => {
        Object.entries(item).forEach(([key, value]) => {
          if (!distinctKeyValuePairs[key] || !distinctKeyValuePairs[key].includes(value)) {
            if (!distinctKeyValuePairs[key]) {
              distinctKeyValuePairs[key] = [];
            }
            distinctKeyValuePairs[key].push(value);
          }
        })
      });

      let uniqueObject = Object.fromEntries(
        Object.entries(distinctKeyValuePairs)
          .filter(([key]) => key !== "_id" && key !== "__v" && key.startsWith("_"))
          .map(([key, value]) => [key.replace(/_/g, ''), value])
      );
      const cur = data?.data[0]
      const AllKeys = Object.keys(cur)
      const temp1 = AllKeys.filter(user => user !== "_id" && user !== "__v" && user[0] === '_');
      const modifiedTemp1 = temp1.map((str) => {
        return str.substring(1);
      });
      let TypeDropdownforallvalue = AllKeys.filter(user => user.slice(0, -5).toLowerCase() === "competency" || user.slice(0, -5).toLowerCase() === "value");
      const AllcompetencyValue = TypeDropdownforallvalue;
      let TypeDropdown = ["All Competency", "All Values"];
      let TypeDropdownCompetency = AllKeys.filter(user => user.slice(0, -5).toLowerCase() === "competency");
      let TypeDropdownValue = AllKeys.filter(user => user.slice(0, -5).toLowerCase() === "value");
      let AllInOne = [TypeDropdownCompetency,TypeDropdownValue];
      let uniqueStrings = new Set();
      TypeDropdownforallvalue = TypeDropdownforallvalue.map(str => {
        let modifiedString = str.substring(0, str.length - 3);
        if (!uniqueStrings.has(modifiedString)) {
          uniqueStrings.add(modifiedString);
          return modifiedString;
        }
      });
      TypeDropdownforallvalue = TypeDropdownforallvalue.filter(str => str !== undefined);
      let uniqueCompetencyAndValue = [];
      const countOfEacCompetencyAndValueQuestion = [];
      for (let i = 0; i < TypeDropdownforallvalue.length; i++) {
        let array = [];
        for (let j = 0; j < AllcompetencyValue.length; j++) {
          if (AllcompetencyValue[j].slice(0, -3) === TypeDropdownforallvalue[i]) {
            array.push(AllcompetencyValue[j]);
          }
        }
        uniqueCompetencyAndValue.push(array);
        countOfEacCompetencyAndValueQuestion.push({ name: TypeDropdownforallvalue[i], len: array.length })
      }
      let arr1 = [], arr2 = [];
      for (let i = 0; i < countOfEacCompetencyAndValueQuestion.length; i++) {
        if (countOfEacCompetencyAndValueQuestion[i].name.slice(0, -2).toLowerCase() === 'competency') {
          arr1.push(countOfEacCompetencyAndValueQuestion[i]);
        }
        else {
          arr2.push(countOfEacCompetencyAndValueQuestion[i]);
        }
      }
      let countOfEachValueQuestion = [arr1, arr2];
      let uniquecompetency = [];
      let uniquevalue = [];
      TypeDropdownforallvalue.map((val) => {
        if (val.slice(0, -2).toLowerCase() === "competency") {
          uniquecompetency.push(val);
        }
        else {
          uniquevalue.push(val);
        }
      })
      let competencyValueInOneArry = [uniquecompetency, uniquevalue];
      
      let totalFeedbacks = data.data.length;
      let len = Object.keys(uniqueObject).length;
      let m = 0;
      for (let l = 0; l < len; l++) {
        let str = "";
        if (demographics === modifiedTemp1[l]) {
          for (let t = 0; t < TypeDropdown.length; t++) {
            let Num = competencyValueInOneArry[t].length;
            let dropdownOption = TypeDropdown[t];
            if (dropdownOption === type) {
              const ParameterValue = uniqueObject[demographics];
              ParameterValue.push("Total")
              setParameterValue([...ParameterValue]);
              m = ParameterValue.length;
              const peopleArrayCompt = new Array(m - 1);
              const peopleCountCompt = new Array(m - 1);
              const peopleArrayValue = new Array(m - 1);
              const peopleCountValue = new Array(m - 1);
              let length = 0;
              for (let i = 0; i < countOfEachValueQuestion[t].length; i++) {
                length += countOfEachValueQuestion[t][i].len;
              }
              for (let i = 0; i < m - 1; i++) {
                peopleArrayCompt[i] = new Array(competencyValueInOneArry[t].length).fill(0);
                peopleCountCompt[i] = new Array(competencyValueInOneArry[t].length).fill(0);
                peopleArrayValue[i] = new Array(length).fill(0);
                peopleCountValue[i] = new Array(length).fill(0);
              }
              for (let i = 0; i < totalFeedbacks; i++) {
                let prop = '_' + demographics;
                str = data.data[i][prop];
                for (let k = 0; k < m - 1; k++) {
                  if (str === ParameterValue[k]) {
                    for (let j = 0; j < AllInOne[t].length; j++) {
                      let zzz = AllInOne[t][j];
                      if (data?.data[i][zzz]) {
                        peopleCountValue[k][j]++;
                        peopleArrayValue[k][j] += Number(data?.data[i][zzz]);
                      }
                    }
                  }
                }
              }
              for (let i = 0; i < m - 1; i++) {
                for (let j = 0; j < peopleArrayValue[i].length; j++) {
                  peopleArrayValue[i][j] /= peopleCountValue[i][j];
                }
              }
              const maxValues = peopleCountValue.map(row => Math.max(...row));
              let xx = 0;
              for (let i = 0; i < maxValues.length; i++) {
                xx += maxValues[i];
              }
              maxValues.push(xx)
              setResponse([...maxValues]);
              for (let i = 0; i < m - 1; i++) {
                let x = 0;
                for (let j = 0; j < length; j++) {
                  let val = 0;
                  let ll = countOfEachValueQuestion[t][x].len
                  for (let k = j; k < (j + ll); k++) {
                    val += peopleArrayValue[i][k];
                  }
                  peopleArrayCompt[i][x] = val / ll;
                  x++;
                  j = j + ll - 1;
                }
              }
              let competency1 = new Array(m - 1);
              for (let i = 0; i < m - 1; i++) {
                competency1[i] = new Array(competencyValueInOneArry[t].length + 1).fill(0);
              }
              for (let p = 0; p < m - 1; p++) {
                let k = 0;
                let calculatedValue = 0;
                for (let i = 0; i < competency1[p].length; i++) {
                  if ((i % (competency1[p].length)) === (competency1[p].length - 1)) {
                    competency1[p][i] = (calculatedValue / (competency1[p].length - 1))
                    calculatedValue = 0;
                    continue;
                  }
                  competency1[p][i] = peopleArrayCompt[p][k];
                  calculatedValue += competency1[p][i];
                  k++;
                }
              }
              let competency3 = new Array(m);
              for (let i = 0; i < m; i++) {
                competency3[i] = new Array(competencyValueInOneArry[t].length + 1).fill(0);
              }
              let dummyarray = new Array(competency3[0].length).fill(0);
              for (let i = 0; i < competency3.length; i++) {
                for (let j = 0; j < competency3[i].length; j++) {
                  if (i === competency3.length - 1) {
                    competency3[i][j] = dummyarray[j] / (competency3.length - 1);
                  }
                  else {
                    competency3[i][j] = competency1[i][j];
                    dummyarray[j] += competency3[i][j];
                  }
                }
              }
              setDataValue([...competency3]);
              let arrayForDefination = [];
              let realcopmetencyvalue = [];
              for (let i = 0; i < competency3[0].length - 1; i++) {
              let pp = competencyValueInOneArry[t][i]
              let zz = ArrayForThemecode[pp][0].theme[0];
                realcopmetencyvalue.push(zz)
                arrayForDefination.push({ name: realcopmetencyvalue[i], defination: ArrayForThemecode[pp][0].statement[0] })
              }
              setAllCompetencyValue([...realcopmetencyvalue]);
              setDefinationArray([...arrayForDefination])
              const competency2 = [];
              for (let b = 0; b < competency3.length - 1; b++) {
                for (let r = 0; r < competency3[b].length - 1; r++) {
                  competency2.push(parseFloat(competency3[b][r]).toFixed(2));
                }
              }
              function sortWithIndexAndPrint(competency2) {
                return competency2
                  .map((element, index) => ({ element, index }))
                  .sort((a, b) => a.element - b.element)
                  .map(({ element, index }) => `Original index: ${index} Element: ${element}`)
                  .join("\n");
              }
              const sortedCompet = sortWithIndexAndPrint(competency2);
              const lines = sortedCompet.split("\n");
              const big_small_value = [];
              const index = [lines[0], lines[1], lines[2], lines[competency2.length - 1], lines[competency2.length - 2], lines[competency2.length - 3]];
              let y = 0;
              let z = 0;
              for (let i = 0; i < index.length; i++) {
                if (i < 3) {
                  const [indexString, elementString] = index[i].split(" Element: ");
                  big_small_value[y + 6] = Number(indexString.split(" ").pop(), 10);
                  big_small_value[y + 7] = Number(parseFloat(elementString, 10).toFixed(2));
                  y += 2;
                }
                else {
                  const [indexString, elementString] = index[i].split(" Element: ");
                  big_small_value[z] = Number(indexString.split(" ").pop(), 10);
                  big_small_value[z + 1] = Number(parseFloat(elementString, 10).toFixed(2));
                  z += 2;
                }
              }
              setNum(Num);
              setCompetValue([...big_small_value]);
            }
          }
        }
      }
      setRespondantRole(totalFeedbacks);
    } catch (err) {
      console.error(err);
    }
  };
  // fetchDataForAllCompetencyBehaviour function --> for all question of every competency in one heatmap 
  // and  all question of every value in another heatmap. 
  const fetchDataForAllCompetencyBehaviour = async () => {
    try {
      let data = {};
      if (Object.keys(allData).length !== 0) {
        data = allData;
      }
      else {
        data = await axios.get(`http://localhost:8010/alldata`);
      }
      const response = await axios.get(`http://localhost:8010/competvalues`);
      let ArrayForEachQuestioncode = {};
      for (let i = 0; i < response.data.length; i++) {
        const { questioncode, driver, description } = response.data[i];
        if (!ArrayForEachQuestioncode[questioncode]) {
          ArrayForEachQuestioncode[questioncode] = new Set();
        }
        ArrayForEachQuestioncode[questioncode].add(JSON.stringify({ driver, description }));
      }
      for (const questioncode in ArrayForEachQuestioncode) {
        ArrayForEachQuestioncode[questioncode] = Array.from(ArrayForEachQuestioncode[questioncode], item => JSON.parse(item));
      }

      let distinctKeyValuePairs = {};
      data.data.map(item => {
        Object.entries(item).forEach(([key, value]) => {
          if (!distinctKeyValuePairs[key] || !distinctKeyValuePairs[key].includes(value)) {
            if (!distinctKeyValuePairs[key]) {
              distinctKeyValuePairs[key] = [];
            }
            distinctKeyValuePairs[key].push(value);
          }
        })
      });
      let uniqueObject = Object.fromEntries(
        Object.entries(distinctKeyValuePairs)
          .filter(([key]) => key !== "_id" && key !== "__v" && key.startsWith("_"))
          .map(([key, value]) => [key.replace(/_/g, ''), value])
      );
      const totalFeedbacks = data.data.length;
      const cur = data?.data[0]
      const AllKeys = Object.keys(cur)
      const temp1 = AllKeys.filter(user => user !== "_id" && user !== "__v" && user[0] === '_');
      const modifiedTemp1 = temp1.map((str) => {
        return str.substring(1);
      });
      let TypeDropdown = ["All Competency Behaviour", "All Values Behaviour"];
      let AllCompetency = AllKeys.filter(user => user.slice(0, -5).toLowerCase() === "competency");
      let AllValue = AllKeys.filter(user => user.slice(0, -5).toLowerCase() === "value");
      let AllCompetencyValue = [AllCompetency, AllValue];
      let len = Object.keys(uniqueObject).length;
      let m = 0;
      for (let l = 0; l < len; l++) {
        let str = "";
        if (demographics === modifiedTemp1[l]) {
          for (let t = 0; t < TypeDropdown.length; t++) {
            let Num = AllCompetencyValue[t].length;
            let dropdownOption = TypeDropdown[t];
            if (dropdownOption === type) {
              const ParameterValue = uniqueObject[demographics];
              ParameterValue.push("Total");
              setParameterValue([...ParameterValue]);
              m = ParameterValue.length;
              const peopleArrayCompt = new Array(m - 1);
              const peopleCountCompt = new Array(m - 1);
              for (let i = 0; i < m - 1; i++) {
                peopleArrayCompt[i] = new Array(AllCompetencyValue[t].length).fill(0);
                peopleCountCompt[i] = new Array(AllCompetencyValue[t].length).fill(0);
              }
              for (let i = 0; i < totalFeedbacks; i++) {
                let prop = '_' + demographics;
                str = data.data[i][prop];
                for (let k = 0; k < m - 1; k++) {
                  if (str === ParameterValue[k]) {
                    for (let j = 0; j < AllCompetencyValue[t].length; j++) {
                      let zzz = AllCompetencyValue[t][j];
                      if (data?.data[i][zzz]) {
                        peopleCountCompt[k][j]++;
                        peopleArrayCompt[k][j] += Number(data?.data[i][zzz]);
                      }
                    }
                  }
                }
              }
              for (let i = 0; i < m - 1; i++) {
                for (let j = 0; j < peopleArrayCompt[i].length; j++) {
                  peopleArrayCompt[i][j] /= peopleCountCompt[i][j];
                }
              }
              const maxValues = peopleCountCompt.map(row => Math.max(...row));
              let xx = 0;
              for (let i = 0; i < maxValues.length; i++) {
                xx += maxValues[i];
              }
              maxValues.push(xx)
              setResponse([...maxValues]);
              let competency1 = new Array(m - 1);
              for (let i = 0; i < m - 1; i++) {
                competency1[i] = new Array(AllCompetencyValue[t].length + 1).fill(0);
              }
              for (let p = 0; p < m - 1; p++) {
                let k = 0;
                let calculatedValue = 0;
                for (let i = 0; i < competency1[p].length; i++) {
                  if ((i % (competency1[p].length)) === (competency1[p].length - 1)) {
                    competency1[p][i] = (calculatedValue / (competency1[p].length - 1))
                    calculatedValue = 0;
                    continue;
                  }
                  competency1[p][i] = peopleArrayCompt[p][k];
                  calculatedValue += competency1[p][i];
                  k++;
                }
              }
              let competency3 = new Array(m);
              for (let i = 0; i < m; i++) {
                competency3[i] = new Array(AllCompetencyValue[t].length + 1).fill(0);
              }
              let dummyarray = new Array(competency3[0].length).fill(0);
              for (let i = 0; i < competency3.length; i++) {
                for (let j = 0; j < competency3[i].length; j++) {
                  if (i === competency3.length - 1) {
                    competency3[i][j] = dummyarray[j] / (competency3.length - 1);
                  }
                  else {
                    competency3[i][j] = competency1[i][j];
                    dummyarray[j] += competency3[i][j];
                  }
                }
              }
              setDataValue([...competency3])
              
              let arrayForDefination = [];
              let realcopmetencyvalue = [];
              for (let i = 0; i < competency3[0].length - 1; i++) {
              let pp = AllCompetencyValue[t][i]
              let zz = ArrayForEachQuestioncode[pp][0].driver[0];
                realcopmetencyvalue.push(zz)
                arrayForDefination.push({ name: realcopmetencyvalue[i], defination: ArrayForEachQuestioncode[pp][0].description[0] })
              }
              setAllCompetencyValue([...realcopmetencyvalue]);
              setDefinationArray([...arrayForDefination])
              const competency2 = [];
              for (let b = 0; b < competency3.length - 1; b++) {
                for (let r = 0; r < competency3[b].length - 1; r++) {
                  competency2.push(parseFloat(competency3[b][r]).toFixed(2));
                }
              }
              function sortWithIndexAndPrint(competency2) {
                return competency2
                  .map((element, index) => ({ element, index }))
                  .sort((a, b) => a.element - b.element)
                  .map(({ element, index }) => `Original index: ${index} Element: ${element}`)
                  .join("\n");
              }
              const sortedCompet = sortWithIndexAndPrint(competency2);
              const lines = sortedCompet.split("\n");
              const big_small_value = [];
              let index = [];
              if (lines.length === 1) {
                index = [lines[0], lines[0]];
              }
              else if (lines.length === 2) {
                index = [lines[0], lines[1], lines[1], lines[0]];
              }
              else {
                index = [lines[0], lines[1], lines[2], lines[competency2.length - 1], lines[competency2.length - 2], lines[competency2.length - 3]];
              }
              let y = 0;
              let z = 0;
              for (let i = 0; i < index.length; i++) {
                if (i < index.length / 2) {
                  const [indexString, elementString] = index[i].split(" Element: ");
                  big_small_value[y + 6] = Number(indexString.split(" ").pop(), 10);
                  big_small_value[y + 7] = Number(parseFloat(elementString, 10).toFixed(2));
                  y += 2;
                }
                else {
                  const [indexString, elementString] = index[i].split(" Element: ");
                  big_small_value[z] = Number(indexString.split(" ").pop(), 10);
                  big_small_value[z + 1] = Number(parseFloat(elementString, 10).toFixed(2));
                  z += 2;
                }
              }
              setNum(Num)
              setCompetValue([...big_small_value]);
            }
          }
        }
      }
      setRespondantRole(totalFeedbacks);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchObject = async (xx) => {
    try {
      const emps = await axios.get(`http://localhost:8010/${xx}s`);
      const temp1 = [];
      await emps?.data?.map(_ => {
        temp1.push({ name: _, isChecked: true });
      })
      var xyz = {};
      xyz[xx] = temp1
      setFilterObject((abc) => ({
        ...abc, ...xyz
      }))
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setRespondantRole([]);
    fetchDataForEachCompetencyAndValue();
    fetchDataForAllCompetency();
    fetchDataForAllCompetencyBehaviour();
  }, [demographics, type]);

  useEffect(() => {
    demographicValue.map((event) => {
      fetchObject(event);
    })
  }, [demographicValue])

  return (
    <Container>
      <div style={{ backgroundColor: 'rgb(161, 163, 164)', borderRadius: '0 0 4px 4px' }}>
        <Accordion style={{ backgroundColor: 'rgb(90, 90, 90)', color: 'white' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ borderRadius: '0 0 4px 4px', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Filter</Typography>
          </AccordionSummary>
          <Typography >
            <Grid style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: 'rgb(161, 163, 164)' }}>
              {
                demographicValue.map((ele) => {
                  return (filterObject && filterObject[ele] ?
                    <Filter title={ele.charAt(0).toUpperCase() + ele.slice(1)} checkedValue={filterObject[ele]} setCheckedValue={setFilterObject} /> : null
                  )
                })
              }
            </Grid>
          </Typography>
          <Typography style={{ padding: '2px 0', height: '45px', width: '100%', backgroundColor: 'rgb(90, 90, 90)', textAlign: 'end', borderRadius: '0 0 4px 4px' }}>
            <button onClick={handleChangeReset} style={{ margin: '5px 0px 0 5px', color: 'white', backgroundColor: 'gray', height: '30px', width: '60px', fontSize: '17px', borderRadius: '4px', border: '1px solid gray' }}>Reset</button>
            <button onClick={handleChangeApply} style={{ margin: '2px 30px 0 5px', color: 'white', backgroundColor: 'green', height: '30px', width: '60px', fontSize: '17px', borderRadius: '4px', border: '1px solid gray' }}>Apply</button>
          </Typography>
        </Accordion>
      </div>
      <Grid container spacing={4}>
        <Grid item xs={12} style={{ fontSize: '10px' }}>
          <br />
          <br />
          <FormControl style={{ marginLeft: '60px', width: '40%' }}>
            <InputLabel id="type" style={{ fontSize: '20px' }}>Type</InputLabel>
            <Select
              labelId="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
            >
              <MenuItem value={'All Competency'}>All Competency</MenuItem>
              <MenuItem value={'All Competency Behaviour'}>All Competency Behaviour</MenuItem>
              <MenuItem value={'All Values'}>All Values</MenuItem>
              <MenuItem value={'All Values Behaviour'}>All Values Behaviour</MenuItem>
              {
                typeDropdown.map((_, index) => <MenuItem value={_} key={index}>{_}</MenuItem>)
              }
            </Select>
          </FormControl>
          <FormControl style={{ marginLeft: '60px', width: '40%' }}>
            <InputLabel id="demographics" style={{ fontSize: '20px' }}>Demographics</InputLabel>
            <Select
              labelId="demographics"
              id="demographics"
              value={demographics}
              onChange={(e) => setDemographics(e.target.value)}
              label="Demographics"
            >
              {
                demographicValue.map((_, index) => <MenuItem value={_} key={index}>{_}</MenuItem>)
              }
            </Select>
          </FormControl>
          <Box style={{ display: 'flex', margin: '0px 200px', fontSize: '23px' }}>
            <h2>Number of Respondant Role: <span style={{ color: 'green' }}>{respondantRole}</span></h2>
          </Box>
        </Grid>
        <Grid item xs={5} style={{ display: 'flex' }} >
          <Grid style={{ marginLeft: '20px' }}>
            {(type === 'All Competency') && <>
              <Grid style={{ marginLeft: '-20px' }}>
                <Grid style={{ width: '1210px', overflow: 'auto' }}>
                  <Grid id="chart" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-20px' }}>
                      <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Area of Development</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'orange', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Strength</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Role Model</div>
                    </div>
                    <Tables value={parameterValue} response={response} allCompetencyValue={allCompetencyValue} datavalue={dataValue} definationarray={definationArray} />
                  </Grid>
                </Grid>
                <Grid style={{ display: 'flex', margin: '20px 0 0 0', width: '100%' }}>
                  <Grid style={{ marginRight: '10px' }}>
                    <BiggestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                  </Grid>
                  <SmallestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                </Grid>
              </Grid>
            </>}
            {type === 'All Values' && <>
              <Grid style={{ marginLeft: '-20px' }}>
                <Grid style={{ width: '1210px', overflow: 'auto' }}>
                  <Grid id="chart" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-20px' }}>
                      <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Area of Development</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'orange', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Strength</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Role Model</div>
                    </div>
                    <Tables value={parameterValue} response={response} allCompetencyValue={allCompetencyValue} datavalue={dataValue} definationarray={definationArray} />
                  </Grid>
                </Grid>
                <Grid style={{ display: 'flex', margin: '20px 0 0 0', width: '100%' }}>
                  <Grid style={{ marginRight: '10px' }}>
                    <BiggestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                  </Grid>
                  <SmallestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                </Grid>
              </Grid>
            </>}
            {(type === 'All Competency Behaviour') && <>
              <Grid style={{ marginLeft: '-20px' }}>
                <Grid style={{ width: '1210px', overflow: 'auto' }}>
                  <Grid id="chart" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-20px' }}>
                      <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Area of Development</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'orange', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Strength</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Role Model</div>
                    </div>
                    <Tables value={parameterValue} response={response} allCompetencyValue={allCompetencyValue} datavalue={dataValue} definationarray={definationArray} />
                  </Grid>
                </Grid>
                <Grid style={{ display: 'flex', margin: '20px 0 0 0', width: '100%' }}>
                  <Grid style={{ marginRight: '10px' }}>
                    <BiggestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                  </Grid>
                  <SmallestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                </Grid>
              </Grid>
            </>}
            {type === 'All Values Behaviour' && <>
              <Grid style={{ marginLeft: '-20px' }}>
                <Grid style={{ width: '1210px', overflow: 'auto' }}>
                  <Grid id="chart" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-20px' }}>
                      <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Area of Development</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'orange', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Strength</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Role Model</div>
                    </div>
                    <Tables value={parameterValue} response={response} allCompetencyValue={allCompetencyValue} datavalue={dataValue} definationarray={definationArray} />
                  </Grid>
                </Grid>
                <Grid style={{ display: 'flex', margin: '20px 0 0 0', width: '100%' }}>
                  <Grid style={{ marginRight: '10px' }}>
                    <BiggestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                  </Grid>
                  <SmallestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                </Grid>
              </Grid>
            </>}
            {typeDropdown.map((event) => event === type && <>
              <Grid style={{ marginLeft: '-20px' }}>
                <Grid style={{ width: '1210px', overflow: 'auto' }}>
                  <Grid id="chart" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-20px' }}>
                      <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Area of Development</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'orange', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Strength</div>
                      <div style={{ marginLeft: '10px', backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}></div>
                      <div>Role Model</div>
                    </div>
                    <Tables value={parameterValue} response={response} allCompetencyValue={allCompetencyValue} datavalue={dataValue} definationarray={definationArray} />
                  </Grid>
                </Grid>
                <Grid style={{ display: 'flex', margin: '20px 0 0 0', width: '100%' }}>
                  <Grid style={{ marginRight: '10px' }}>
                    <BiggestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                  </Grid>
                  <SmallestTable value={parameterValue} response={competValue} num={num} allCompetencyValue={allCompetencyValue} />
                </Grid>
              </Grid>
            </>)}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Report