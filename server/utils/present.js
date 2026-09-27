export function presentUser(user, { email = false, following = [] } = {}) {
  return {
    id: String(user._id),
    name: user.name,
    username: user.username,
    email: email ? user.email : undefined,
    avatar: String(user.avatar || '').replace('background=0D0C22', 'background=1AA05A'),
    bio: user.bio,
    location: user.location,
    socialLinks: user.socialLinks,
    pro: user.pro,
    agency: user.agency,
    followers: user.followers || 0,
    following,
  }
}

export function presentDesign(design) {
  const author = design.user
  return {
    id: String(design._id),
    title: design.title,
    description: design.description,
    image: design.image,
    tags: design.tags,
    category: design.category,
    likes: design.baseLikes || 0,
    likedBy: (design.likes || []).map(String),
    savedBy: (design.saves || []).map(String),
    views: design.views || 0,
    createdAt: new Date(design.createdAt).getTime(),
    author: author
      ? {
          id: String(author._id),
          name: author.name,
          username: author.username,
          avatar: author.avatar,
          pro: author.pro,
          agency: author.agency,
          location: author.location,
          bio: author.bio,
          followers: author.followers || 0,
        }
      : null,
  }
}

export function presentComment(comment) {
  return {
    id: String(comment._id),
    designId: String(comment.design),
    userId: String(comment.user?._id || comment.user),
    name: comment.user?.name || 'Designer',
    avatar: comment.user?.avatar || '',
    text: comment.text,
    createdAt: new Date(comment.createdAt).getTime(),
  }
}
