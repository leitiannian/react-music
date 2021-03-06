import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Loading from 'base/loading/loading'
import MmNav from 'components/mm-nav/mm-nav'

import {HTTP_OK} from 'common/config'
import {getTopListDetail} from 'api'

import './toplist.scss'

// 排行榜页面

class TopList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      officialList: [],
      globalList: [],
      artistList: null,
    }
  }
  
  componentDidMount() {
    getTopListDetail()
    .then(res => {
      if (res.data.code === HTTP_OK) {
        // console.log(res.data.list)
        let officialList = [], globalList = [], artistList = res.data.artistToplist;
        res.data.list.forEach((item) => {
          if (item.ToplistType) {
            officialList.push({
              id: item.id,
              name: item.name,
              coverImgUrl: item.coverImgUrl,
              description: item.description,
              updateFrequency: item.updateFrequency,
              tracks: item.tracks,
              ToplistType: item.ToplistType
            })
          } else {
            globalList.push({
              id: item.id,
              name: item.name,
              coverImgUrl: item.coverImgUrl,
              description: item.description,
              updateFrequency: item.updateFrequency
            })
          }
        });
        this.setState({
          officialList, globalList, artistList
        })
      }
    })
  }
  
  render() {
    const {officialList, globalList, artistList} = this.state;
    // console.log(artistList)
    return (
      <div className="mm-wrapper toplist">
        <MmNav title="排行榜"/>
        {
          officialList.length > 0 ?
            <div className="mm-content">
              <h1 className="toplist-title">官方榜单</h1>
              <div className="row-list">
                {
                  officialList.map(item => (
                    <Link to={`/playlist/${item.id}`} className="row-item" key={item.id}>
                      <div className="item-hd">
                        <img src={`${item.coverImgUrl}?param=150y150`} alt=""/>
                        <p>{item.updateFrequency}</p>
                      </div>
                      <div className="row-item-bd">
                        {
                          item.tracks.map((tracks, index) => (
                            <p key={`${item.id}${index}`}>{`${tracks.first}-${tracks.second}`}</p>
                          ))
                        }
                      </div>
                    </Link>
                  ))
                }
                {
                  artistList && artistList.name && (
                    <div className="row-item">
                      <div className="item-hd">
                        <img src={`${artistList.coverUrl}?param=150y150`} alt=""/>
                        <p>{artistList.updateFrequency}</p>
                      </div>
                      <div className="row-item-bd">
                        {
                          artistList.artists.map((item, index) => (
                            <p key={`${item.third}${index}`}>{`${item.first}    ${item.third}`}</p>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
              </div>
              <h1 className="toplist-title">全球榜</h1>
              <div className="column-list">
                {
                  globalList.map(item => (
                    <div className="column-item" key={item.id}>
                      <div className="item-hd">
                        <img src={`${item.coverImgUrl}?param=150y150`} alt=""/>
                        <p>{item.updateFrequency}</p>
                      </div>
                      <div className="column-bd">{item.name}</div>
                    </div>
                  ))
                }
              </div>
            </div>
            : <Loading/>
        }
      </div>
    )
  }
}

export default TopList
