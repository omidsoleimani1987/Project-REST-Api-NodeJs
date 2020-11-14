// send all posts
exports.getPosts = (req, res, next) => {
  // return a json response
  // json is provided by express to return json data
  // passing normal object to the json and it convert it automatically
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post content',
        imageUrl: 'images/bootstrap.jpg',
        creator: {
          name: 'omid'
        },
        createdAt: new Date()
      }
    ]
  });
};

// create a post
exports.createPost = (req, res, next) => {
  // create the post in db later
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: 'Post created successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: 'omid'
      },
      createdAt: new Date()
    }
  });
};
