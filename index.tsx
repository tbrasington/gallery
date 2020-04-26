import React, { useState } from "react"
import ReactDOM from "react-dom"
import Gallery from "./src/index"



ReactDOM.render(
  <Gallery><div key="slide0">slide 0</div><div key="slide1">slide 1</div><div key="slide2">slide 2</div><div key="slide3">slide 3</div><div key="slide4">slide 4</div></Gallery>,
  document.getElementById("app"))



  /* 
  
    todo:

    expose controls to be custom in appearance and placement

  */
