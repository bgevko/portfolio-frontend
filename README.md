

- [Frontend](#frontend)
  - [Project setup](#project-setup)
  - [App.js](#appjs)
  - [App.css](#appcss)
  - [Pages](#pages)
    - [HomePage.js](#homepagejs)
    - [BlogPage.js](#blogpagejs)
    - [ViewBlogPage.js](#viewblogpagejs)
    - [ContactPage.js and OrderPage.js](#contactpagejs-and-orderpagejs)
    - [GalleryPage.js](#gallerypagejs)
  - [Components](#components)
    - [AddPostBtn Component](#addpostbtn-component)
    - [ArticlePreview Component](#articlepreview-component)
    - [BlogForm Component](#blogform-component)
    - [Card Component](#card-component-1)
    - [Dialog Component](#dialog-component)
    - [IconBtn Component](#iconbtn-component)
    - [MainNav Component](#mainnav-component)
    - [MobileNav Component](#mobilenav-component)
    - [MoreContent Component](#morecontent-component)
    - [ScrimOverlay Component](#scrimoverlay-component)
    - [Section Component](#section-component)
    - [SiteFooter Component](#sitefooter-component)
    - [SiteHeader Component](#siteheader-component)
  - [Create, Edit, and Delete easy reference](#create-edit-and-delete-easy-reference)
    - [Opening a blank creation form](#opening-a-blank-creation-form)
    - [Opening an edit form for an article](#opening-an-edit-form-for-an-article)
    - [Deleting an article](#deleting-an-article)

# Frontend
## Project setup
Some notable libraries: 
- `react-markdown`: to turn markdown text into an HTML blog post
- `react-syntax-highlighter`: to highlight code blocks in the blog post
- `react-transition-group`: to create basic animations for switching between pages and components

## App.js

### States
```js
  const [blog, updateBlog] = useState([])
  const [searchTags, updateSearchTags] = useState([])
  const [errorActive, setErrorActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmActive, setConfirmActive] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
```

**blog**: an array of blog posts.

**searchTags**: an array of tags that are shared between all blog posts. This is used to filter by tags in the blog page.

**errorActive, errorMessage, confirmActive, confirmMessage**: these are used to display error and confirmation messages to the user. They are combined with a timer to make the messages disappear after a few seconds.

### Reference to main element
```js
  const mainRef = useRef(null)
  const scrollToTop = () => {
    mainRef.current.scrollTo(0, 0)
  }
```
This is used to get a reference to the main element, which is used to scroll to the top of the page.

### Search tags
```js
useEffect(() => {
    const search_tags = blog.reduce((acc, cur) => {
      cur.tags.forEach(tag => {
          if (!acc.includes(tag)) {
              acc.push(tag);
          }
      });
      return acc;
    }, []);
    updateSearchTags(search_tags.sort());
  }, [blog])
```
This gets all the tags from each blog posts and puts them in an array. It then removes duplicates and sorts them alphabetically. This is used to display the tag filter buttons on the blog page.

### Error and confirmation messages
```js
  useEffect(() => {
    if (errorActive && confirmActive) {
      setConfirmActive(false)
      setTimeout(() => { 
        if (errorActive) setErrorActive(false)
        setConfirmActive(true)
        setTimeout(() => { setConfirmActive(false) }, 3000)
      }, 4000)
    }
  }, [errorActive, confirmActive])
```
This is used to handle an edge case for when both error and confirmation messages are active at the same time. The error message gets displayed first, then the confirmation message.

### GlobalContext.Provider
```jsx
<GlobalContext.Provider value={{ 
  blog, 
  updateBlog,
  searchTags, 
  setErrorActive,
  setErrorMessage,
  setConfirmActive,
  setConfirmMessage,
  scrollToTop
}}>
```
I've used context part of the react library. This allows me to pass certain variables and functions to all components without having to pass them as props. This is useful because I can pass functions to components that are several levels deep without having to pass them through each component in between. 

### Routes
```jsx
{blog.map((article) => (
  <Route 
    key={article._id} 
    path={`/blog/${(article.title).replace(/\s+/g, '-').toLowerCase()}`} 
    element={<ViewBlogArticle article={article} />} />
))}
```
This is used to create a dynamic route for each blog post. The article title is converted to a slug and is used as the the URL path.

## App.css
I didn't copy the old CSS file to this project. I redesigned a lot of the elements and ended up creating a new sheet to try and fit my workflow.

## Pages
### HomePage.js
This takes one prop, `article`, which is not the intro article, but the first article in the blog. It's rendered at the bottom of the page as a preview of the latest blog post. 


#### CSS Transitions
```jsx
<CSSTransition
    in={true}
    nodeRef={heroRef}
    timeout={200}
    classNames="fade"
    unmountOnExit
    appear
>
```
This component is used anytime I want to create a transition for another component. I use it in a few other places as well.

#### Latest Blog Post
```jsx
{ article &&
  <MoreContent section_title="LATEST BLOG POST">
      <ArticlePreview article={article} include_fancy_link={true} edit_enabled={false}/>
  </MoreContent>
  }
```
This is  a conditional render that will display the `MoreContent` component if the article prop is not undefined. This component is just a regular section but with a different style h4. The child of this component is the `ArticlePreview` component, which is used to display a preview of the article. The `include_fancy_link` prop is used to display a link to the full article. The `edit_enabled` prop is used to display an edit button and delete button for the article.

### BlogPage.js
#### States
```js
  const [filterTags, setFilterTags] = useState([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
```
**filterTags**: an array of tags that are used to filter the blog posts by tag. If a tag is checked, then only blog posts with that tag will be displayed.

**search**: a string that is used to filter the blog posts by title. If the search string is included in the title of a blog post, then it will be displayed.

**formOpen**: a boolean that is used to determine if the blog form is open or not. The blog form is used to create or edit blog posts.

#### handleTagClick
```js
const handleTagClick = (e) => {
    const tagValue = e.target.value;
    const checked = e.target.checked;
    if (checked && !filterTags.includes(tagValue)) {
        setFilterTags([...filterTags, tagValue]);
    } else if (!checked && filterTags.includes(tagValue)) {
        setFilterTags(filterTags.filter(tag => tag !== tagValue));
    }
}
```
This adds or removes tags from the `filterTags` state when a tag checkbox is clicked.

#### Rendering the tag checkboxes
```jsx
<span className="search-tags">
    {
        searchTags?.map(tag => {
            /* format for id and value attributes */
            const modifiedTag = tag.replace(' ', '-').toLowerCase();

            /* format for display */
            const formattedTag = tag.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            
            return (
            <Fragment key={modifiedTag}>
                <input type="checkbox" id={modifiedTag} name="tag" value={tag} onChange={handleTagClick}/>
                <label htmlFor={modifiedTag}>{`#${formattedTag}`}</label>
            </Fragment>
            );
        })
    }
</span>
```
This creates a slug for each tag and uses it as the id and value attributes for the checkbox input. A formatted tag is also created, which is used as the label for the checkbox.

#### Add form button
```jsx
<AddPostBtn setFormOpen={setFormOpen}/>
```
This opens the blog form for creating a new blog post. The `setFormOpen` function is called from the `AddPostBtn` component.

#### Search and filtering logic
The rest of the code handles conditional rendering of posts based on the search and filters. Post instances are rendered as `ArticlePreview` components. 

### ViewBlogPage.js
This page provides a detailed view of a blog post. It also allows the option to edit or delete the blog post.

#### Props
- **article**: the article object from which the page is rendered

#### States
- **dialogOpen / dialogResponse**: This is used to open a custom alert box that is used to confirm the deletion of a blog post.
- **formOpen**: Signifies if the edit form is open or not.

#### Editing / Deleting articles
Edit functionality is similar to the `ArticlePreview` component; the article is passed as a prop to the `BlogForm` component, which handles the editing logic. Both `ArticlePreview` and this component send the same DELETE request to the backend, though they are seperate processes which should be refactored later. 

#### Random Articles
```js
  let randomArticle;
  if (blog && blog?.length > 1) {
    do {
      randomArticle = blog[Math.floor(Math.random() * blog?.length)];
    } while (randomArticle._id === article._id);
  }
```
This creates a random article to display at the bottom of the page.

#### Markdown
For this page, I used the `react-markdown` library to convert the markdown text into HTML. I also used the `react-syntax-highlighter` library to highlight code blocks in the blog post.

```js
// slug generate helper
  function generateSlug(text) {
    return text.toLowerCase().replace(/\W/g, '-')
  }

  // React-markdown renderer that generates an id heading elements
  function Heading({level, children}) {
    const text = children.reduce((text, child) => (typeof child === 'string' ? text + child : text), '');
    const slug = generateSlug(text);
    return React.createElement('h' + level, {id: slug}, children)
  }

  // React-markdown renderer for code blocks that uses Prism syntax highlighter
  function CodeBlock({language, value}) {
    return (
      <SyntaxHighlighter style={a11yDark} language={language} PreTag="div" children={value} />
    )
  }
```
These are helper functions that are used by the `react-markdown` library to render the markdown text. The `Heading` function is used to generate an id for each heading element. The `CodeBlock` function is used to highlight code blocks in the blog post.

#### Dynamic local navigation
I configured my page to set up a local navigation based on the headings in the blog post. I do this by passing the `Heading` component as a prop to the `ReactMarkdown` component, which tell react-markdown to place an id on each heading element. I then make a list of all the heading elements and use that to create a local navigation.

##### Passing the Heading component to ReactMarkdown
```jsx
  <ReactMarkdown
    className="markdown-content"
    children={article?.content}
    components={{
      h1: Heading,
      h2: Heading,
      h3: Heading,
      h4: Heading,
      h5: Heading,
      h6: Heading,
      code: ({node, inline, className, children, ...props}) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} {...props} />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
    />
```
This prop is part of the react-markdown library and the implementation is based on its documentation. 

##### Setting up the local navigation
```jsx
  const tableOfContents = article?.content?.match(/#+\s.+/g)?.map(heading => {
    const headingText = heading.replace(/#+\s/, '');
    return [headingText, generateSlug(headingText)]
  })

  //.. further down
  {tableOfContents && <h3>CONTENTS</h3>}
    <nav>
      {
        tableOfContents?.map(headingContent => {
          const [navText, navId] = headingContent;
          return (
            <a href={`#${navId}`} key={navId}>{navText}</a>
          )
        })
      }
    </nav>
```
I set the table of contents as a `[headingText, headingId]` array. I then map that array to a list of anchor elements that link to the corresponding heading element. The table of contents is generated if there are any headings in the blog post. Otherwise, it's not displayed.

#### Other information
The rest of the code is used to display the article information and the random article at the bottom of the page. There are also social media share buttons, but they don't do anything yet. Lastly, there's also a dialog that will prompt the user to confirm the deletion of the blog post.

### ContactPage.js and OrderPage.js
These pages handle form entry and on submission, send a POST request to the backend. I use some of the global context variables here that I set in the `App.js` file, which are used to display error and confirmation messages to the user.

### GalleryPage.js
The gallery uses the `<Card>` component to display photos of various project in a reactive grid. 

#### galleryItems
```jsx
  {   
    photo: bioSite,
    title: "Biology Website",
    subtitle: "Desktop Layout",
    content: "I created this static website to host an assignment for a biology class. I used Figma to make the initial design and implemented it using the Jekyll framework. I deployed it using GitHub pages.",
    actionLabel: "View Project",
    actionUrl: 'https://bgevko.github.io/bi101-portfolio/index.html'
  },
```
I store each gallery item as an object in an array, which is then mapped to the `<Card>` component later on. 

#### States and open/close card logic
```jsx
const [openCard, setOpenCard] = useState(null);
```
Every card shares this state so that only card can be open at a time. If the user opens another card, then the previously opened card will close.

#### Card component
```jsx
<GlobalContext.Provider value={{openCard, setOpenCard}}>
    {galleryItems.map((item, index) => (
        <Card
            key={index}
            index={index}
            photo={item.photo}
            title={item.title}
            subtitle={item.subtitle}
            content={item.content}
            actionLabel={item.actionLabel}
            actionUrl={item.actionUrl}
        />
    ))}
</GlobalContext.Provider>
```
This maps the information from `galleryItems` into the `<Card>` component. The `index` prop is used to determine if the card is open or not. If the index matches the `openCard` state, then the card is open. Otherwise, it's closed.

## Components
I'll briefly explain what each component does and what props they take.

### AddPostBtn Component
This is a button that opens the blog form. It takes one prop, `setFormOpen`, which is a function that sets the `formOpen` state in the blog page.

### ArticlePreview Component
This component provides a preview of a blog post. It also provides an modal interface to edit and delete the blog post.

#### Props
- **article**: the article object
- **include_fancy_link**: a boolean that determines if the article title should be a link to the full article
- **edit_enabled**: a boolean that determines if the edit and delete buttons should be displayed

#### States
- **dialogOpen**: This is used to open a custom alert box that is used to confirm the deletion of a blog post.
- **dialogResponse**: This is used to store the user's response to the dialog box. It has three states: `null`, `true`, and `false`. `null` means the dialog box is not open. `true` means that the user has confirmed the dialog action. `false` means that the user has cancelled the dialog action.
- **formOpen**: Signifies if the edit form is open or not.
- **inAnimation**: Use by the `CSSTransition` component to determine when the component should animate in and out.

#### Animation data
```js
  const articleRef = useRef(null);
  const animationTime = 500; // change this to match CSS transition time
```
Information for `CSStransition` component.

#### handleEdit
```js
  const handleEdit = () => {
    setFormOpen(true);
  }

  //.. further down
  <IconBtn type="edit" action={handleEdit}/>

  //..

  <ScrimOverlay open={formOpen} />
  <BlogForm formOpen={formOpen} setFormOpen={setFormOpen} article={article}/>
```
When the user clicks the edit button, `handleEdit()` is executed, which sets `formOpen` to `true`. When the `formOpen` state is set to `true`, the form renders below passing the article object as a prop. `<BlogForm>` handles the editing logic and post creation logic. The `<ScrimOverlay>` component is used to darken the background when the form is open.

#### handleDelete
Deleting the form is a multi step process. First, the user clicks the delete button, which opens a dialog box. The user then confirms the deletion, which sets the `dialogResponse` state to `true`. Then, the event listener that is listening for changes to the `dialogResponse` state will execute the `handleDelete()` function, which will send a DELETE request to the backend.

##### Clicking the delete button
```js
const handleDelete = () => {
    setDialogOpen(true);
  }

  //.. further down
  <IconBtn type="delete" action={handleDelete}/>

  //..

  <ScrimOverlay open={dialogOpen} />
      <Dialog 
          title='Delete Article?'
          message='This action cannot be undone.'
          active={dialogOpen}
          setResponse={setDialogResponse}
      />
```
When the user clicks the delete button, `handleDelete()` is executed, which sets `dialogOpen` to `true`. When the `dialogOpen` state is set to `true`, the dialog box renders. The `<Dialog>` component takes the `setDialogResponse` function as a prop, which sets the `dialogResponse` state to `true` or `false` depending on the user's response. Meanwhile, the `useEffect()` hook is listening for changes to the `dialogResponse` state.

##### Dialog response listener
```js
useEffect(() => {
    if (dialogResponse === true) {
      setinAnimation(false);
      handleDeleteArticle();
      setDialogOpen(false);
      setDialogResponse(null);
    } else if (dialogResponse === false) {
      setDialogOpen(false);
      setDialogResponse(null);
    }
  }, [dialogResponse])
```
When `dialogResponse` changes, this function checks the response and either cancels cancels the delete or executes `handleDeleteArticle()`, closing the dialog box and resetting the `dialogResponse` state after both actions. 

##### handleDeleteArticle
```js
const handleDeleteArticle = async () => {
    const response = await fetch(`/blog/${article._id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setConfirmMessage('Article deleted.');
      setConfirmActive(true);
      setTimeout(() => { setConfirmActive(false) }, 3000);

      // Give the component time to animate out
      setTimeout(() => {
        updateBlog(prevState => prevState.filter(item => item._id !== article._id));
      }, animationTime);
    } else {
      // get error message from response body or default to response status
      const data = await response.json()
      setErrorMessage(`${response.status} error: ${data.error}`);
      setErrorActive(true);
      setTimeout(() => { setErrorActive(false); }, 4000);
    }
  }
```
This functions sends a DELETE request to the backend. If the request is successful, then the blog post is removed from the `blog` state and a confirmation message is displayed for 3 seconds. There's a slight delay before the blog post is removed from the `blog` state to allow the component to smoothly animate out. If the request is unsuccessful, then an error message is displayed for 4 seconds.

#### Other info
The rest of the code is used to populate the article preview component with information from the article object. Article tags are displayed as normal text and are not clickable like the filter tags in the blog page. The `include_fancy_link` prop is used to determine if the article title should be a link to the full article, which is mapped to the `/blog/<article-slug-title>`, which is a Route declared in `App.js`. The `edit_enabled` prop is used to determine if the edit and delete buttons should be displayed.

### BlogForm Component
This component is a modal form that is used for editing and creating new articles. 

#### Props
- **formOpen**: a boolean that determines if the form should be open or not
- **setFormOpen**: a function that sets the `formOpen` state in the parent component
- **article**: the article object. If this prop is undefined, the form will create a new article. Otherwise, the form will populate the fields with the article information.

#### States and Variables
- **Form Fields**: These fields correspond to the fields in the form. Their initial state is either an empty string or the corresponding value from the article object.
- **dialogOpen**: This is used to open a custom alert box that is used to confirm the closing of the form.
- **dialogResponse**: This is used to store the user's response to the dialog box. It has three states: `null`, `true`, and `false`. `null` means the dialog box is not open. `true` means that the user has confirmed the dialog action. `false` means that the user has cancelled the dialog action.
- **editMode**: A boolean that determines if the form is in edit mode. This determines which HTTP method is used when sending the form data to the backend.
- **formRef and inputRef**: References for animating the opening and closing of the form.

#### Initial Open State
```js
  useEffect(() => {
    if (formOpen) {
      setArticleTitle(article ? article.title : '');
      setAuthor(article ? article.author : '');
      setPublishDate(article ? articleDate : today);
      setPreview(article ? article.preview : '');
      setContent(article ? article.content : '');
      setTags(article ? article.tags.join(', ').replaceAll(',', ', ') : '');
    }
  }, [article, formOpen])
```
This makes sure that the form is consistently populated with the correct information when it opens.

#### handleFormSubmit
This function will send a POST or PUT request when the user clicks the submit button. If the user decides to cancel, the dialog box will open if the form has changed since it was opened. If the user confirms the dialog, the form will close and all changes will be discarded. Otherwise, the dialog box will close and the form will remain open. Here's a more detailed breakdown:

##### User cliks the submit button
```js
const handleSubmitArticle = async (e) => {
    e.preventDefault();

    const formData = {
      title: articleTitle,
      author: author,
      publishDate: publishDate,
      preview: preview,
      content: content,
      tags: tags
    }
    //.. 
}
    //.. somewhere below
    <form 
      ref={formRef}
      tabIndex='0'
      onSubmit={handleSubmitArticle}
      onKeyDown={handleKeyDown}
      id='article-form'
    >
    //..
    <button type='submit'id='article-submit-btn'>Submit</button>
```
User clicks the submit button, which begins executing `handleSubmitArticle()` and storing the form data.

##### POST request
```js
const handleSubmitArticle = async (e) => {
    //..

    // If not in edit mode, send POST request to create new article
    if (!editMode) {
      const response = await fetch('/blog', {
          method: 'post',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        // Use json data from response to update blog state
        const newArticle = await response.json();
        updateBlog(prevState => [newArticle, ...prevState]);
        setFormOpen(false);
        resetForm();
        setTimeout(() => {
          setConfirmMessage('Article created.');
          setConfirmActive(true);
          setTimeout(() => { setConfirmActive(false) }, 3000);
        }, 300)
      } else {
          const statusCode = response.status;
          const errorMessage = await response.text();
          setErrorMessage(`Error ${statusCode}: ${errorMessage}`);
          setErrorActive(true);
          setTimeout(() => { setErrorActive(false) }, 4000);
      }
    } 
```
If the form is not in edit mode, then a POST request is sent to the backend. If the request is successful, then the blog state, the form closes, and a confirmation message is displayed. Otherwise, an error message is displayed.

##### PUT request
```js
const handleSubmitArticle = async (e) => {
    //..
    
    // If in edit mode, send PUT request to update existing article
    else {
      const response = await fetch(`/blog/${article?._id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        // Use json data from response to update blog state
        const updatedArticle = await response.json();
        updateBlog(prevState => prevState.map(item => {
          if (item._id === updatedArticle._id) {
            return updatedArticle;
          }
          return item;
        }));
        setFormOpen(false);
        resetForm();
        setTimeout(() => {
          setConfirmMessage('Article updated.');
          setConfirmActive(true);
          setTimeout(() => { setConfirmActive(false) }, 3000);
        }, 300)

      } else {
        const statusCode = response.status;
        const errorMessage = await response.text();
        setErrorMessage(`Error ${statusCode}: ${errorMessage}`);
        setErrorActive(true);
        setTimeout(() => { setErrorActive(false) }, 4000);
      }
    }
  }
```
If the form is in edit mode, then a PUT request is sent to the backend. If the request is successful, then the blog state, the form closes, and a confirmation message is displayed. Otherwise, an error message is displayed.

#### handleCloseForm

##### Triggering the close event
```js
  const handleCloseForm = () => {
    if (allFieldsDefault()) {
      setFormOpen(false);
      return;
    }
    setDialogOpen(true);
  }
  //..
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCloseForm();
    }
  }
  // Later below
  <button type="button" aria-label='close article form' id='article-cancel-btn' onClick={handleCloseForm}>Cancel</button>
  //..
  <ScrimOverlay active={formOpen} handleClick={handleCloseForm} zValue='100'/>
```
Form cancelation can be triggered in three ways: clicking the cancel button, clicking outside of the form, or by pressing the escape key. `<ScrimOverlay>` receives the `handleCloseForm` function as a prop, which allows it to trigger the close event when the user clicks on the dimmed background.

##### No detected changes
```js
  const handleCloseForm = () => {
    if (allFieldsDefault()) {
      setFormOpen(false);
      return;
    }
    setDialogOpen(true);
  }

  const allFieldsDefault = () => {
    if (
      articleTitle === '' && 
      author === '' && 
      publishDate === today && 
      preview === '' && 
      content === '' && 
      tags === '') {
      return true;
    } else if (
      article && articleTitle === article.title &&
      article && author === article.author &&
      article && publishDate === articleDate &&
      article && preview === article.preview &&
      article && content === article.content &&
      // remove spaces from tags and article.tags and compare
      article && tags.replaceAll(' ', '') === article.tags.join(',').replaceAll(' ', '')
    ) {
      return true;
    } else {
      return false;
    }
  }
```
When the user clicks cancel, the `handleCloseForm()` will check if any changes have been made to the form. If no changes have been made, then the form will close without an alert box. Otherwise, the dialog box will open.

##### Detected changes
```js
  useEffect(() => {
    if (dialogResponse === true) {
      setFormOpen(false);
      setDialogOpen(false);
      setDialogResponse(null);
      resetForm();
    }
    if (dialogResponse === false) {
      setDialogOpen(false);
      setDialogResponse(null);
      inputRef.current.focus();
    }
  }, [dialogResponse])

    const resetForm = () => {
    setArticleTitle(article ? article.title : '');
    setAuthor(article ? article.author : '');
    setPublishDate(article ? articleDate : today);
    setPreview(article ? article.preview : '');
    setContent(article ? article.content : '');
    setTags(article ? article.tags.join(', ') : '');
  }
```
When there are unsaved changes, the user will have to confirm that they want to close the form. If the user confirms the action, then the form will be reset and closed. Otherwise, the dialog box will close and the form will remain open.

### Card Component
This component is used to display a gallery item. It can be expanded or collapsed by clicking on the chevron button. 
#### Special Props
- **index**: Index of the card. Used to determine if the card is open or not.
- **actionLabel**: Optional prop. If this is included, then an action button will be displayed at the bottom of the card.
- **actionUrl**: This is also optional and will take the user to an external URL when clicked..

### Dialog Component
This component is used to display a custom alert box. 
#### Special Props
- **active**: This determines when the dialog is open or not and is used to trigger the animation.
- **setResponse**: This prop is used in the parent component to determine what action to take based on the user's response.

### IconBtn Component
Used for creating the edit and delete buttons for articles.

### MainNav Component
Displays the main navigation for the page

### MobileNav Component
Displays the mobile navigation for the page. This won't be visible unless the screen width is less than 768px. This should also be kept in alignment with the `<MainNav>` component.

### MoreContent Component
A section component with a different style h4. Used for the latest blog post and article recommendation sections at the bottom of pages

### ScrimOverlay Component
This is used to darken the background when a modal is open. 
#### Props
- **active**: This determines when the overlay is open or not and is used to trigger the animation.
- **handleClick**: This prop is used in the parent component to determine what action to take when the user clicks on the overlay (outside the form).
- **zValue**: This is used to set the z-index of the overlay. It should be set to a higher value than the background you want to dim (useful when you need more than one overlay).

### Section Component
This is just like a normal `<section>` element, but it transitions in and out when it's mounted and unmounted. This is useful to create a smooth transition between pages.

### SiteFooter Component
This component receives the `MobileNav` component as a child in `App.js`. When the screen width is less than 768px, the `MobileNav` component will be turned on (by CSS) and this component will create a scroll event listener that will hide the `MobileNav` component when the user scrolls down and show it when the user scrolls up. When the screen size is bigger than 768px, this component will display the normal footer and the event listener will be removed.

### SiteHeader Component
Displays the site banner and the main navigation.

## Create, Edit, and Delete easy reference
### Opening a blank creation form
- **BlogPage.js** page -> **AddPostBtn** component -> **BlogForm** component

### Opening an edit form for an article
- **ArticlePreview** component -> **BlogForm** component
- **ViewBlogPage.js** page -> **BlogForm** component

### Deleting an article
- **ArticlePreview** component -> **Dialog** component -> **ArticlePreview** component
- **ViewBlogPage.js** page -> **Dialog** component -> **ViewBlogPage.js** page

# Backend
## Project setup
I used a single additional library for the backend, `xss` to sanitize user input. I created a different entry point for the app, `app.js` and I seperated the controllers and models into seperate files.

## app.js
Entry point for the app. The routes for my controllers are defined here. I also set up the database connection here.

## Controllers
I have two controllers: `blogController.js`, `contactController.js`. I added an additional middleware function that helps me validate request bodies.

## Models
I have one model for the blog posts, `blogModel.js`. This is exactly the same model I used for the database assignment. 
