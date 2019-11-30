let Andi = {
  name: 'Andi',
  email: 'andi@gmail.com',
  productReviews: {
    1 : {
      productId: {
        id: 1,
        name: 'Drunk Elephant'
      },
      userId: 1,
      rating: 4
    },
    2: {
      productId: {
        id: 2,
        name: 'The Ordinary'
      },     
      userId: 1,
     rating: 5
    },
    // 3: {
    //   productId: {
    //     id: 5,
    //     name: 'Farmacy'
    //   },       
    //   userId: 1,
    //   rating: 5
    // }
  }
}

let Athena = {
  name: 'Athena',
  email: 'athena@gmail.com',
  productReviews: {
   1 : {
     productId: {
       id: 1,
       name: 'Drunk Elephant'
     },
     userId: 2,
     rating: 5
   },
   2: {
    productId: {
      id: 2,
      name: 'The Ordinary'
    },     
    userId: 2,
    rating: 3
   },
  //  3: {
  //   productId: {
  //     id: 3,
  //     name: 'Cetaphil'
  //   }, 
  //   userId: 1,
  //   rating: 5
  //   }
  }
}

// testing for similarity score 
// users will always have same array length and same product names
const euclideanDistance = (user1, user2) => {
  const n = user1.length

  let coefficient = 0

  if (n === 0) {
    return n
  }

  for (let i = 0; i < n; i++) {
    coefficient += Math.pow(user1[i].rating - user2[i].rating, 2)
  }

  return 1 / (1 + Math.sqrt(coefficient))
}

// compares both users and returns array of product ids they both have reviews for 
const getSameReviews = (user1, user2) => {
  let user1Reviews = []
  for (let key in user1.productReviews) {
    user1.productReviews[key].productId['rating'] = user1.productReviews[key].rating
    user1Reviews.push(user1.productReviews[key].productId)
  }

  let user2Reviews = []
  for (let key in user2.productReviews) {
    user2.productReviews[key].productId['rating'] = user2.productReviews[key].rating
    user2Reviews.push(user2.productReviews[key].productId)
  }
  
  let sameReviews = []
  for (let i = 0; i < user1Reviews.length; i++) {
    if (user2Reviews[i].id === user1Reviews[i].id) {
      sameReviews.push(user1Reviews[i].id)
    }
  }

  let user1All = user1Reviews.filter(review => {
    if (sameReviews.includes(review.id)) {
      return review
    }
  })

  let user2All = user2Reviews.filter(review => {
    if (sameReviews.includes(review.id)) {
      return review
    }
  })

  return euclideanDistance(user1All, user2All)

}

console.log(getSameReviews(Andi, Athena))
