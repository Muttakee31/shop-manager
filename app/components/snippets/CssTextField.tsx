import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

const CssTextField = withStyles({
  root: {
    '& label': {
      color: '',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#277ea7',
    },
    '& label.Mui-focused': {
      color: '#277ea7',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#277ea7',
    },
    '& .MuiInputBase-input': {
      color: ''
    },
    '& input': {
      color: '',
    },
    '& .MuiInputBase-root': {
      color: '',
    },
    '& .MuiFormLabel-root': {
      color: '',
    },
    '& .MuiSelect-select.MuiSelect-select': {
      color: '',
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: '#c1bbae',
    }
  },
})(TextField);

export default CssTextField;
