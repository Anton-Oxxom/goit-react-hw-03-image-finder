import React from 'react';
import { Component } from 'react';
import Notiflix from 'notiflix';

import { Searchbar } from './searchbar';
import { ImageGallery } from './imageGallery';
import { Modal } from './modal';
import { Loader } from 'components/loader';
import { Button } from 'components/button';
import { fetchImages } from 'API/fetchImages';

import styles from './App.module.css';

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    totalImg: 0,
    loading: false,
    error: null,
    isModal: false,
    modalImg: null,
    tags: '',
  };

  componentDidUpdate(prevProps, prevState) {
      if (prevState.page !== this.state.page || prevState.query !== this.state.query) {
      this.loadImages();
    }
  }

  loadImages = () => {
    const { page, query } = this.state;
    this.setState({ loading: true, error: null });
    fetchImages(query, page)
      .then(images => {
        const pictures = images.hits.map(
          ({ id, webformatURL, tags, largeImageURL }) => ({
            id,
            webformatURL,
            tags,
            largeImageURL,
          })
        );

        if (!images.hits.length) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }

        if (page === 1 && images.hits.length) {
          Notiflix.Notify.success(
            `Hooray! We found ${images.totalHits} images.`
          );
        }

        const totalPage = images.totalHits / (page * images.hits.length);
        if (totalPage <= 1) {
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }

        this.setState(prevState => ({
          images: [...prevState.images, ...pictures],
          totalImg: images.totalHits,
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ loading: false }));
  };

  changeSearch = query => {
    this.setState({ query: query, page: 1, images: [] });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  toggleModal = (modalImg = null, tags = '') => {
    this.setState(prevState => ({
      isModal: !prevState.isModal,
      modalImg,
      tags,
    }));
  };

  render() {
    const { isModal, modalImg, tags, loading, images, totalImg, error } =
      this.state;
    return (
      <div className={styles.App}>
        <Searchbar changeSearch={this.changeSearch} />
        <ImageGallery images={images} toggleModal={this.toggleModal} />
        {loading && <Loader />}
        {images.length > 0 && images.length < totalImg && (
          <Button handleLoadMore={this.handleLoadMore} />
        )}
        {isModal && (
          <Modal
            modalImg={modalImg}
            onCloseModal={this.toggleModal}
            tags={tags}
          />
        )}
        {error && <>{error.message}</>}
      </div>
    );
  }
}