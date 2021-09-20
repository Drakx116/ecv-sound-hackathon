import { motion } from "framer-motion";
import play from "../../assets/svg/play.svg";
import styles from "./Play.module.css";

function Play() {
  return (
    <motion.button
      whileHover={{
        scale: 1.1,
      }}
      whileTap={{ scale: 0.9 }}
      className={styles.neon}
    >
      <img src={play} height={48} width={48} alt="" />
    </motion.button>
  );
}

export default Play;
