<template>
<div>
  <h1 class="text-center">YouTube Video Comment Threads</h1>
  <!-- params setting-->
  <div style="margin-top: 30px;">
    <el-input placeholder="Video Link" v-model="videoLink">
      <template slot="prepend">Video Link</template>
      <el-button slot="append" type="primary" icon="el-icon-search" @click="queryComments">Start Query</el-button>
    </el-input>
  </div>
  <el-form ref="form-keyword" label-position="'top'" style="margin-top: 30px;">
    <el-form-item label="Filter Comment Text by Keywords (Not Applied to Replys of Comment)">
      <el-tag>{{commentThreadsDisplay.length}} Comments</el-tag>
      <el-input placeholder="seperate mutiple keywords by space, eg. game like" v-model="keywords"></el-input>
    </el-form-item>
  </el-form>
  <hr>
  <!-- results in table -->
  <el-table v-if="queryCompleted"
    :data="commentThreadsDisplay"
    :default-sort = "{prop: 'likes', order: 'descending'}"
    border
    height="600"
    style="width: 100%">
    <el-table-column type="expand" label="Replies" width="90">
      <template slot-scope="props">
        <!-- {{props.row.replies}} -->
        <h4 class="text-center">Replys of Comment</h4>
        <el-table :data="props.row.replies" style="border:1px solid gray">
          <el-table-column prop="author" label="Author" sortable width="180">
          </el-table-column>
          <el-table-column prop="text" sortable label="Text">
          </el-table-column>
          <el-table-column prop="numLikes" label="#Like" sortable width="120">
          </el-table-column>
          <el-table-column prop="publishedAt" label="Publish Date" sortable width="160">
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="author" label="Author" sortable width="180">
    </el-table-column>
    <el-table-column prop="text" sortable label="Text">
    </el-table-column>
    <el-table-column prop="numLikes" label="#Like" sortable width="120">
    </el-table-column>
    <el-table-column prop="numReplies" label="#Reply" sortable width="120">
    </el-table-column>
    <el-table-column prop="publishedAt" label="Publish Date" sortable width="160">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'CommentSimple',
    data() {
      return {
        youtubeBaseUrl: 'https://www.youtube.com/watch?v=',
        commentThreadsBaseUrl: 'https://www.googleapis.com/youtube/v3/commentThreads/',
        commentBaseUrl: 'https://www.googleapis.com/youtube/v3/comments',
        videoLink: 'https://www.youtube.com/watch?v=Rvr68u6k5sI',
        // optional links
        // coco trailer: https://www.youtube.com/watch?v=Rvr68u6k5sI
        // hakuna matata: https://www.youtube.com/watch?v=NQ6nPoIFDWw
        videoId: '',
        commentThreads: [],
        commentThreadsDummy: [], // collect raw comment
        pageToken: '',
        keywords: '',
        queryCompleted: false,
      }
    },
    watch: {
      videoLink: function() {
        this.updateVideoId()
      },
      // keywords: function() {
      //   this.filterCommentThread()
      // }
    },
    computed: {
      keywordArray: function() {
        return this.keywords.split()
      },
      // comments for display
      commentThreadsDisplay: function() {
        return this.filterCommentThread(this.commentThreads)
      }
    },
    methods: {
      // query controller
      queryComments() {
        this.keywords = ''
        this.commentThreads = []
        this.commentThreadsDummy = []
        this.queryCompleted = false; // disable render process
        this.buildCommentThreadsApiRequest()
      },
      // filter comment threads by keywords
      filterCommentThread() {
        var keywordArray = []
        if (!this.keywords) {
          return this.commentThreads
        } else {
          keywordArray = this.keywords.split(' ')
        }

        if(this.commentThreads.length) {
          return this.commentThreads.filter(el => {
            // filter by keywords
            for (var index in keywordArray) {
              var keyword = keywordArray[index]
              if (el.text.indexOf(keyword) == -1) {
                return false
              }
            }
            return true
          })
        }else{
          return []
        }
      },

      // dummy -> origin -> display
      initCommentThreadsDisplay() {
        this.commentThreads = this.buildCommentThreadsObject(this.commentThreadsDummy)
        this.commentThreadsDisplay = this.filterCommentThread(this.commentThreads)
      },

      // filter response data and reconstruct comment threads object
      buildCommentThreadsObject(commentThreads) {
        return commentThreads.map(topLevelComment => {
          var replies = [];
          if (topLevelComment.replies && topLevelComment.replies.comments && topLevelComment.replies.comments.length) {
            replies = topLevelComment.replies.comments.map(reply => {
              return {
                author: reply.snippet.authorDisplayName,
                text: reply.snippet.textOriginal,
                numLikes: reply.snippet.likeCount,
                publishedAt: reply.snippet.publishedAt.slice(0, 10),
              }
            })
          }
          return {
            author: topLevelComment.snippet.topLevelComment.snippet.authorDisplayName,
            text: topLevelComment.snippet.topLevelComment.snippet.textOriginal,
            numLikes: topLevelComment.snippet.topLevelComment.snippet.likeCount,
            numReplies: topLevelComment.snippet.totalReplyCount,
            publishedAt: topLevelComment.snippet.topLevelComment.snippet.publishedAt.slice(0, 10),
            replies: replies
          }
        })
      },
      // build main api request
      buildCommentThreadsApiRequest(pageToken) {
        let self = this
        let params = null
        if (pageToken == undefined) {
          params = this.buildCommentThreadsApiParams()
        } else {
          params = this.buildCommentThreadsApiParams(pageToken)
        }
        axios.get(self.commentThreadsBaseUrl, {
          params: params
        }).then(response => {
          let data = response.data;
          // merge two arrays into one
          Array.prototype.push.apply(self.commentThreadsDummy, data.items);
          self.$notify({
            title: self.commentThreadsDummy.length + ' ' + 'Comments Retrieved.',
            type: 'info'
          });
          // if not only one page, use recursive api call
          if (data.nextPageToken) {
            self.pageToken = data.nextPageToken;
            // add some delay to allow next page token take effect
            setTimeout(() => {
              self.buildCommentThreadsApiRequest(data.nextPageToken);
            }, 100);
          } else {
            self.initCommentThreadsDisplay()
            self.queryCompleted = true; // change status
            self.$notify({
              title: self.commentThreadsDummy.length + ' ' + 'Comments Retrieved in Total.',
              type: 'success',
              duration: 0
            });
          }
        }).catch(error => {
          self.initCommentThreadsDisplay()
          self.queryCompleted = true; // change status
          this.$notify({
            title: self.commentThreadsDummy.length + ' ' + 'Comments Retrieved in Total but with Errors.',
            type: 'warning',
            duration: 0
          });
          console.log(error);
        });
      },
      // build main api params
      buildCommentThreadsApiParams(pageToken) {
        if (pageToken == undefined) pageToken = '';
        return {
          videoId: this.videoId,
          maxResults: 100,
          order: 'relevance',
          part: 'snippet,replies',
          key: 'AIzaSyBpdhMIamKprhu9Z9f9sipUddNmNa0x5qs',
          pageToken: pageToken,
        }
      },
      // // retrieve replies of comments
      // buildCommentsApiRequest(pageToken) {
      //   let self = this
      //   let params = null
      //   if (pageToken == undefined) {
      //     params = this.buildCommentThreadsApiParams()
      //   } else {
      //     params = this.buildCommentThreadsApiParams(pageToken)
      //   }
      //   axios.get(self.commentThreadsBaseUrl, {
      //     params: params
      //   }).then(response => {
      //     let data = response.data;
      //     // merge two arrays into one
      //     Array.prototype.push.apply(self.commentThreadsDummy, data.items);
      //     self.$notify({
      //       title: self.commentThreadsDummy.length + ' ' + 'Comments Retrieved.',
      //       type: 'info'
      //     });
      //     // if not only one page, use recursive api call
      //     if (data.nextPageToken) {
      //       self.pageToken = data.nextPageToken;
      //       self.buildCommentThreadsApiRequest(data.nextPageToken)
      //     } else {
      //       self.initCommentThreadsDisplay()
      //       self.queryCompleted = true; // change status
      //       self.$notify({
      //         title: self.commentThreadsDummy.length + ' ' + 'Comments Retrieved in Total.',
      //         type: 'success',
      //         duration: 0
      //       });
      //     }
      //   }).catch(error => {
      //     self.initCommentThreadsDisplay()
      //     self.queryCompleted = true; // change status
      //     this.$notify({
      //       title: self.commentThreadsDummy.length + ' ' + 'Comments Retrieved in Total but with Errors.',
      //       type: 'warning',
      //       duration: 0
      //     });
      //     console.log(error);
      //   });
      // },
      // buildCommentsApiParams(parentId, pageToken) {
      //   if (pageToken == undefined) pageToken = '';
      //   return {
      //     parentId: parentId,
      //     maxResults: 100,
      //     order: 'relevance',
      //     part: 'snippet',
      //     key: 'AIzaSyBpdhMIamKprhu9Z9f9sipUddNmNa0x5qs',
      //     pageToken: pageToken,
      //   }
      // },
      updateVideoUrl(id) {
        this.videoLink = this.youtubeBaseUrl + this.videoId
      },

      updateVideoId(link) {
        this.videoId = this.getURLParam(this.videoLink, 'v')
      },

      getURLParam(url, name) {
        if (!url) {
          url = window.location.href;
        };
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(url);
        if (!results) {
          return null
        };
        if (!results[2]) {
          return ''
        };
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
    },
    mounted() {
      this.updateVideoId()
    }
  }
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .input-label {
    width: 30px;
  }

  .col-25 {
    display: inline-block;
    width: 25%;
    padding: 10px;
  }

  .padding {
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
