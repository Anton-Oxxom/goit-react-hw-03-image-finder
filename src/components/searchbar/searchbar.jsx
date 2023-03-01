import { Component } from 'react';
import PropTypes from 'prop-types';
import Notiflix from 'notiflix';
import { FcSearch } from 'react-icons/fc';

import styles from './searchbar.module.css';

export class Searchbar extends Component {
  state = {
    input: '',
  };
  static propTypes = {
    changeSearch: PropTypes.func.isRequired,
  };

  handleSearch = element => {
    this.setState({ input: element.currentTarget.value.toLowerCase() });
  };

  onSubmit = element => {
    element.preventDefault();
    const { input } = this.state;
    const { changeSearch } = this.props;
    if (input.trim() === '') {
      return Notiflix.Notify.failure(
        'Please enter your query in query text box.'
      );
    }

    changeSearch(input);
  };

  render() {
    const { input } = this.state;
    return (
      <header className={styles.searchbar}>
        <form className={styles.form} onSubmit={this.onSubmit}>
          <input
            className={styles.input}
            type="text"
            autoComplete="off"
            autoFocus
            value={input}
            onChange={this.handleSearch}
            placeholder="Search images and photos"
          />

          <button type="submit" className={styles.button}>
            <FcSearch className={styles.buttonIcon} />
            <span className={styles.buttonLabel}>Search</span>
          </button>
        </form>
      </header>
    );
  }
}