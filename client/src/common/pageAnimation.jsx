import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageAnimation = ({ children, keyvalue, transition,  initial ={opacity: 0}, animate = {opacity:1}, Classname}) => {
  const fadeInOut = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
       <motion.div
    key={keyvalue}
      variants={fadeInOut}
      initial={initial}
      animate={animate}
      transition={{transition }} // Adjust the duration for the fade effect
      className={Classname}
    >
      {children}
    </motion.div>
    </AnimatePresence>
   
  );
};

export default PageAnimation;
