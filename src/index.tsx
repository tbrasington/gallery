import { ResizeObserver } from "@juggle/resize-observer"
import { wrap } from "@popmotion/popcorn"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import useMeasure from "react-use-measure"
import styles from "./index.module.css"

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

const Gallery: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {

  const originalChildren = React.Children.toArray(children)
  const slideTotal = React.Children.count(children)
  const originalNodeArray = originalChildren.map((item: any, index: number) => ({ "key": item.key, "position": index }))
  const mutatedNodeArray = originalNodeArray.map((x) => x)
  const showSlices = 6

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

  // motion and sizing
  const [ref, bounds] = useMeasure({ polyfill: ResizeObserver })

  const containerWidth = bounds.width
  const slideWidth = (containerWidth * .7) + convertRemToPixels(4)
  const trayWidth = slideWidth * showSlices
  // events

  const paginate = (newDirection: number) => {
    const treeIndex = wrap(0, slideTotal, slide + newDirection)

    setPosition({
      slide: slide + newDirection,
      direction: newDirection,
      tree: mutatedNodeArray.slice(treeIndex, treeIndex + showSlices)
    })

  }

  // motion
  const variants = {
    initial: {
      x: (slideWidth - ((containerWidth - slideWidth) / 2)) * -1,
    },
    direction: {
      x: (containerWidth) * -1,
    }
  }

  return (
    <div className={styles.container} ref={ref}>

      {bounds.width > 1 &&
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            variants={variants}
            initial="initial"
            animate={direction !== 0 ? "direction" : "initial"}

            transition={{
              x: { type: "spring", stiffness: 200, damping: 200 }
            }}
            className={styles.track}
            style={{
              width :  trayWidth
            }}>
            {tree.map((node, index) => {
              return (
                <div key={index} className={styles.slide} style={{ width: `${slideWidth}px` }}>
                  <div>
                    {(node.position === imageIndex ? "🟢" : "🔵") + node.key}
                  </div>
                </div>)
            })}
          </motion.div>
        </AnimatePresence>}

        <div>{imageIndex}</div>

        <div>
          <button onClick={() => paginate(-1)}>Previous</button>
          <button onClick={() => paginate(1)}>Next</button>
        </div>

    </div>)
}

export default Gallery
