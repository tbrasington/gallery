import { wrap } from "@popmotion/popcorn"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import styles from "./index.css"

const Gallery: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {

  const originalChildren = React.Children.toArray(children)
  const slideTotal = React.Children.count(children)
  const originalNodeArray = originalChildren.map((item: any, index: number) => ({ "key": item.key, "position": index }))
  const mutatedNodeArray = originalNodeArray.map((x) => x)
  const showSlices = 3

  // first tree to show
  mutatedNodeArray.splice(0, 0, originalNodeArray[slideTotal - 1])
  mutatedNodeArray.splice(slideTotal + 1, 0, originalNodeArray[0])

  // state
  const [{ slide, direction, tree }, setPosition] = useState({
    slide: 0,
    direction: 0,
    tree: mutatedNodeArray.slice(0, showSlices)
  })

  const imageIndex = wrap(0, slideTotal, slide)

  const containerWidth = window.innerWidth
  const slideWidth = containerWidth *.8
  // events
  const paginate = (newDirection: number) => {
    const treeIndex = wrap(0, slideTotal, slide + newDirection)

    setPosition({
      slide: slide + newDirection,
      direction: newDirection
      , tree: mutatedNodeArray.slice(treeIndex, treeIndex + showSlices)
    })
  }

  // motion
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? window.innerWidth * 0.9 : -window.innerWidth * 0.9,
        opacity: 0,
      }
    },
    center: {
      x: (((slideWidth * slideTotal) - containerWidth) / 2) *-1,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? window.innerWidth * 0.9 : -window.innerWidth * 0.9,
        opacity: 0,
      }
    }
  }

  return (
    <div className={styles.container}>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div 
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 200 },
            opacity: { duration: 0.7 },
          }}
          className={styles.track} style={{
            width: `${slideTotal * 100}%`
          }}>
          {tree.map((node, index) => {
            return (
              <div key={index} className={styles.slide}>
                {(node.position === imageIndex ? "🟢" : "🔵") + node.key}
              </div>)
          })}
        </motion.div>
      </AnimatePresence>

      <div>{imageIndex}</div>

      <div>
        <button onClick={() => paginate(-1)}>Previous</button>
        <button onClick={() => paginate(1)}>Next</button>
      </div>
    </div>)
}

export default Gallery
 