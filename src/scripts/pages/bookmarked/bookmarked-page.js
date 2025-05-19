import { showFormattedDate } from '../../utils/formatter';
import StoryIdb from '../../data/story-idb';

class BookmarkedPage {
    constructor() {
        this._initialUI = `
            <div class="skip-link">
                <a href="#content" class="skip-to-content">Skip to content</a>
            </div>
            <section id="content" class="container">
                <h1 class="page-title">Bookmarked Stories</h1>
                <div id="loading" class="loading-indicator"></div>
                <div id="stories-container" class="stories-container"></div>
            </section>
        `;
    }

    async render() {
        return this._initialUI;
    }

    async afterRender() {
        this._initElements();
        await this._loadBookmarkedStories();
    }

    _initElements() {
        this._loadingElement = document.getElementById('loading');
        this._storiesContainer = document.getElementById('stories-container');
    }

    async _loadBookmarkedStories() {
        try {
            this._showLoading();
            const stories = await StoryIdb.getAllStories();
            this._displayStories(stories);
        } catch (error) {
            this._showError(error.message);
        } finally {
            this._hideLoading();
        }
    }

    _displayStories(stories) {
        if (stories.length === 0) {
            this._storiesContainer.innerHTML = '<p class="empty-message">No bookmarked stories yet</p>';
            return;
        }

        let storiesHTML = '';
        stories.forEach((story) => {
            storiesHTML += `
                <article class="story-item" data-story-id="${story.id}">
                    <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image">
                    <div class="story-content">
                        <h2 class="story-title">${story.name}</h2>
                        <p class="story-date">${showFormattedDate(story.createdAt)}</p>
                        <p class="story-description">${story.description}</p>
                        <div class="story-actions">
                            <a href="#/detail/${story.id}" class="story-link">View Details</a>
                            <bookmark-button class="bookmark-btn"></bookmark-button>
                        </div>
                    </div>
                </article>
            `;
        });

        this._storiesContainer.innerHTML = storiesHTML;

        // Initialize bookmark buttons
        const bookmarkButtons = document.querySelectorAll('bookmark-button');
        bookmarkButtons.forEach((button, index) => {
            button.story = stories[index];
            button.addEventListener('bookmark-removed', (e) => {
                const article = button.closest('article.story-item');
                if (article) article.remove();
                if (this._storiesContainer.querySelectorAll('article.story-item').length === 0) {
                    this._storiesContainer.innerHTML = '<p class="empty-message">No bookmarked stories yet</p>';
                }
            });
        });
    }

    _showLoading() {
        this._loadingElement.style.display = 'block';
    }

    _hideLoading() {
        this._loadingElement.style.display = 'none';
    }

    _showError(message) {
        this._storiesContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
}

export default BookmarkedPage; 