import styles from './ActionBar.module.css';

export default () => {
    return (
        <div className={ styles.actionBar }>
            <button> PLAY </button>
            <button> PAUSE </button>
            <button> SHUFFLE </button>
        </div>
    );
};
