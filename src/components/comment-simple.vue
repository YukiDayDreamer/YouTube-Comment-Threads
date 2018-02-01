<template>
<div>
  <h1 class="text-center">YouTube Video Comment Thread</h1>
  <!-- parameters -->
  <el-row :gutter="10">
    <el-col :span="6">
      <span class="input-label">Video Link</span>
    </el-col>
    <el-col :span="18">
      <el-input placeholder="Video Link" v-model="videoLink"></el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <span class="input-label">Video ID</span>
    </el-col>
    <el-col :span="18">
      <el-input placeholder="Video ID" v-model="videoId"></el-input>
    </el-col>
  </el-row>
  <div class="padding" style="text-align:center;">
    <el-button type="primary" icon="el-icon-search" @click="queryComments">Start Query</el-button>
  </div>

  <el-row>
    <el-col :span="12">
      <span class="input-label">Filter Comment Text by Keywords (Not Applied to Replys of Comment)</span>
      <el-input placeholder="seperate mutiple keywords by space, eg. game like" v-model="keywords"></el-input>
    </el-col>
  </el-row>
  <hr>
  <!-- results in div -->
  <!-- <el-row>
    <el-col :span="3">
      <div class="grid-content">User</div>
    </el-col>
    <el-col :span="15">
      <div class="grid-content">Comment</div>
    </el-col>
    <el-col :span="3">
      <div class="grid-content">#Like</div>
    </el-col>
    <el-col :span="3">
      <div class="grid-content">#Reply</div>
    </el-col>
  </el-row>
  <el-row v-if="queryCompleted" v-for="commentThread in commentThreads" :key="commentThread.id">
    <el-col :span="3"><div class="grid-content">{{commentThread.snippet.topLevelComment.snippet.authorDisplayName}}</div></el-col>
    <el-col :span="15"><div class="grid-content">{{commentThread.snippet.topLevelComment.snippet.textOriginal}}</div></el-col>
    <el-col :span="3"><div class="grid-content">{{commentThread.snippet.topLevelComment.snippet.likeCount}}</div></el-col>
    <el-col :span="3"><div class="grid-content">{{commentThread.snippet.totalReplyCount}}</div></el-col>
  </el-row> -->
  <!-- results in table -->
  <el-table
    :data="commentThreads"
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
        videoLink: 'https://www.youtube.com/watch?v=it1QEtiAsus',
        apiBaseUrl: 'https://www.googleapis.com/youtube/v3/commentThreads/',
        videoId: 'it1QEtiAsus',
        commentThreadsVirtual: [],
        keywords: '',
        queryCompleted: false
      }
    },
    watch: {
      videoId: function() {
        this.videoLink = this.youtubeBaseUrl + this.videoId;
      },
      videoLink: function() {
        this.videoId = this.getURLParam(this.videoLink, 'v');
      }
    },
    computed: {
      commentThreads: function() {
        let keywordArray = []
        if (this.keywords) {
          keywordArray = this.keywords.split(' ');
        } else {
          keywordArray = []
        }
        if (this.queryCompleted && this.commentThreadsVirtual.length) {
          // map to data object
          return this.compressCommentObject(this.commentThreadsVirtual).filter(el => {
            // filter by keywords
            for (var index in keywordArray) {
              var keyword = keywordArray[index]
              if (el.text.indexOf(keyword) == -1) {
                return false
              }
            }
            return true
          });
        } else {
          return [];
        }
      },
      keywordArray: function() {
        return this.keywords.split()
      }
    },
    methods: {
      queryComments() {
        this.commentThreads = [];
        this.commentThreadsVirtual = [];
        this.queryCompleted = false; // disable render process
        this.buildApiRequest();
      },

      compressCommentObject(comments) {
        return comments.map(topLevelComment => {
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

      buildApiRequest(pageToken) {
        let self = this
        let params = null
        if (pageToken == undefined) {
          params = this.buildApiParam()
        } else {
          params = this.buildApiParam(pageToken)
        }
        axios.get(self.apiBaseUrl, {
          params: params
        }).then(response => {
          let data = response.data;
          // merge two arrays into one
          Array.prototype.push.apply(self.commentThreadsVirtual, data.items);
          console.log(self.commentThreadsVirtual);
          // if not only one page, use recursive api call
          if (data.nextPageToken) {
            self.buildApiRequest(data.nextPageToken)
          } else {
            self.queryCompleted = true; // change status
            console.log('Steaming Finished.');
          }
        })
      },

      buildApiParam(pageToken) {
        if (pageToken == undefined) pageToken = '';
        return {
          videoId: this.videoId,
          maxResults: 100,
          pageToken: pageToken,
          order: 'relevance',
          part: 'snippet,replies',
          key: 'AIzaSyBpdhMIamKprhu9Z9f9sipUddNmNa0x5qs'
        }
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
