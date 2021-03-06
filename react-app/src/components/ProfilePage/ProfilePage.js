import React, { useState, useEffect, useRef, useCallback } from "react";
import Moment from "react-moment"
import { Modal, useModalContext } from "../../context/Modal"
import { useParams, Link } from "react-router-dom"
import "./ProfilePage.css"
import { unFollowRider, followRider } from "../../services/rides"

const ProfilePage = () => {

  const [currentUser, setCurrentUser] = useState({});
  const [rides, setRides] = useState();
  const [committedRides, setCommittedRides] = useState()
  const [following, setFollowing] = useState()
  const [ridePage, setRidePage] = useState(true)
  const [commitPage, setCommitPage] = useState(false)
  const [followingPage, setFollowingPage] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const { user, setUser } = useModalContext();


  const { userId } = useParams();

  useEffect(() => {
    if (!userId) {
      return
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const users = await response.json();
      // console.log(users)
      setCurrentUser(users.user);
      setRides(users.rides);
      setCommittedRides(users.committedRides);
      setFollowing(users.following);
    })();
  }, [userId]);




  useEffect(() => {
    if (currentUser && user) {
      user.following.map((followers) => {
        if (followers.id === currentUser.id) {
          setIsFollowing(true)
        }
      })
    }
  }, [currentUser, user])



  return (
    <>
      { currentUser && user.user && <div className="profile-page-container">
        <div className="grid-container">
          <div className="item1" id={ridePage ? "is-selected" : ""}
            onClick={() => {
              setRidePage(true)
              setCommitPage(false)
              setFollowingPage(false)
            }}
          >
            {currentUser.id === user.user.id ? "Your rides" : "Their rides"}
          </div>
          <div className="item2" id={commitPage ? "is-selected" : ""}
            onClick={() => {
              setRidePage(false)
              setCommitPage(true)
              setFollowingPage(false)
            }}
          >Committments</div>
          <div className="item3" id={followingPage ? "is-selected" : ""}
            onClick={() => {
              setRidePage(false)
              setCommitPage(false)
              setFollowingPage(true)
            }}
          >Following</div>
          <div className="profile-info">
            <div>{currentUser.username}</div>
            <div>{currentUser.city}, {currentUser.state}</div>
            <div>{currentUser.level}</div>
            {currentUser && user && (<div>
              {currentUser.id === user.user.id && <button>Edit</button>}
              {currentUser.id !== user.user.id && <div>{isFollowing ?
                <button
                  onClick={async () => {
                    const result = await unFollowRider(user.user.id, currentUser.id)
                    setIsFollowing(false)
                    setUser(result)
                  }}
                >Unfollow</button> :
                <button
                  onClick={async () => {
                    const result = await followRider(user.user.id, currentUser.id)
                    setIsFollowing(true)
                    setUser(result)
                  }}
                >Follow</button>
              }</div>}
            </div>)}
          </div>
          <div className="main-feed">
            {ridePage && rides && (
              <div className='ride-feed-container'>{
                rides.map((ride, idx) => (

                  <Link key={idx} to={`/rides/${ride.id}`} className="link">
                    <div className="ride-grid-container">
                      <div className="level-image"></div>
                      <div className="ride-title">{ride.title}</div>
                      <div className="ride-content">{ride.content}</div>
                      <div className="ride-date"><Moment format="MMM D" date={ride.date} /></div>
                    </div>
                  </Link>
                ))
              }
              </div>
            )}
            {commitPage && committedRides && (
              <div className='ride-feed-container'>{
                committedRides.map((ride, idx) => (

                  <Link key={idx} to={`/rides/${ride.id}`} className="link">
                    <div className="ride-grid-container">
                      <div className="ride-level-image"></div>
                      <div className="ride-title">{ride.title}</div>
                      <div className="ride-content">{ride.content}</div>
                      <div className="ride-date"><Moment format="MMM D" date={ride.date} /></div>
                    </div>
                  </Link>
                ))
              }
              </div>
            )}

            {followingPage && following && (
              <div className='ride-feed-container'>{
                following.map((user, idx) => (

                  <Link key={idx}
                    to={`/profile/${user.id}`}
                    className="link"
                    onClick={() => {
                      setIsFollowing(false)
                      setRidePage(true)
                      setCommitPage(false)
                      setFollowingPage(false)
                    }}
                  >
                    <div className="following-grid-container">
                      <div className="profile-image"></div>
                      <div className="user-level">{user.level}</div>
                      <div className="user-username">{user.username}</div>
                      <div className="user-location">{user.city}, {user.state}</div>
                    </div>
                  </Link>
                ))
              }
              </div>
            )}
          </div>
        </div>
      </div>}

    </>
  )
}

export default ProfilePage;
