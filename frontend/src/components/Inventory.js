import React, {Component} from 'react';
import axios from 'axios';
import { Button, Container, CssBaseline, TextField, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(12),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(4),
    },
    submit: {
      margin: theme.spacing(3, 0, 3),
    },
});

class Inventory extends Component {
    csvLink = React.createRef()

    constructor(props) {
        super(props);
        
        this.state = {
            product: '',
            amount: '',
            location: '',
            inventory: [],
            data: []
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
      axios.get("http://localhost:4000/api/inventory?pageIndex=1")
        .then(res => this.setState({inventory: res.data}))
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {

        const inventory = {
            product: this.state.product,
            amount: this.state.amount,
            location: this.state.location
        }

        console.log(inventory)

        if (e.nativeEvent.submitter.name === "create") {
          axios.post("http://localhost:4000/api/createInventory/", inventory)
            .then(res => console.log(res.data));
        }

        if (e.nativeEvent.submitter.name === "edit") {
          console.log("http://localhost:4000/api/"+this.state.product)
          axios.patch("http://localhost:4000/api/"+this.state.product, inventory)
            .then(res => console.log(res.data));
        } 

        if (e.nativeEvent.submitter.name === "delete"){
          axios.delete("http://localhost:4000/api/update/"+this.state.product, inventory)
            .then(res => console.log(res.data));
        }

        axios.get("http://localhost:4000")
          .then(res => this.setState({inventory: res.data}))
    }


    render() {
        const { classes } = this.props
        return(
          <Container component="main" maxWidth="md">
            <CssBaseline />
              <Grid item xs={8}>
                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="product"
                        label="Product"
                        name="product"
                        autoFocus
                        value={this.state.product}
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="amount"
                        label="Amount"
                        name="amount"
                        value={this.state.amount}
                        onChange={this.onChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="create"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Create Inventory
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="edit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Edit Inventory
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="delete"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Delete Inventory
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid> 
          </Container>
        )
    }
}

export default withStyles(useStyles)(Inventory);