import React, { useState } from "react"
import ReactDOM from "react-dom"
import { wrap } from "@popmotion/popcorn"

const Gallery: React.FC<{

  children?: React.ReactNode

}> = ({ children }) => {

  const originalChildren =  React.Children.toArray(children)
  const slideTotal = React.Children.count(children)

  const originalNodeArray = originalChildren.map((item: any, index: number)=> ({"key"  : item.key, "position" : index}))

  const mutatedNodeArray = originalNodeArray.map((x) => x)
  //mutatedNodeArray.splice(0,0,originalNodeArray[slideTotal-1])
  //mutatedNodeArray.pop()
  const showSlices = 3
  
  mutatedNodeArray.splice(0, 0, originalNodeArray[slideTotal-1])
  mutatedNodeArray.splice(slideTotal+1, 0, originalNodeArray[0])
  console.info("mutated", mutatedNodeArray)

  // state
  const [{slide, direction,  tree}, setPosition] = useState({
      slide : 0, 
      direction : 0, 
      tree : mutatedNodeArray.slice(0,showSlices)
   })
  
  const imageIndex = wrap(0, slideTotal, slide)

  // events
  const paginate = (newDirection: number) => {

 
    
    const treeIndex = wrap(0, slideTotal, slide + newDirection)
   
    setPosition({
      slide : slide + newDirection, 
      direction : newDirection
      , tree :   mutatedNodeArray.slice(treeIndex ,treeIndex + showSlices)
    })

  }

  return (
    <div>
      <div style={{display:"flex", flexDirection:"column"}}>
      {tree.map((node,index)=> {
        return(<div key={index} style={{
          
        }}>{ (node.position === imageIndex ? "🟢" : "🔵") +  node.key}</div>) 
      })}
      </div>
      <div>{imageIndex}</div>
      <div></div>
      <div>
        <button onClick={() => paginate(-1)}>Previous</button>
        <button onClick={() => paginate(1)}>Next</button>
      </div>
    </div>)
}

ReactDOM.render(
  <Gallery><div key="slide0">slide 0</div><div key="slide1">slide 1</div><div key="slide2">slide 2</div><div key="slide3">slide 3</div><div key="slide4">slide 4</div></Gallery>,
  document.getElementById("app"))



  /* 
  
    todo:

    expose controls to be custom in appearance and placement

  */
