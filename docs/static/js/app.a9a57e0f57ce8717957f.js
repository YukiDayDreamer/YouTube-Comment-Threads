webpackJsonp([1],{NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n("7+uW"),i=n("zL8q"),r=n.n(i),s=(n("tvR6"),{render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]});var a=n("VU/8")({name:"App"},s,!1,function(e){n("jzi9")},null,null).exports,l=n("/ocq"),m=n("mtWM"),p=n.n(m),d={name:"CommentSimple",data:function(){return{youtubeBaseUrl:"https://www.youtube.com/watch?v=",commentThreadsBaseUrl:"https://www.googleapis.com/youtube/v3/commentThreads/",commentBaseUrl:"https://www.googleapis.com/youtube/v3/comments",videoLink:"https://www.youtube.com/watch?v=Rvr68u6k5sI",videoId:"",commentThreads:[],commentThreadsDummy:[],pageToken:"",keywords:"",queryCompleted:!1}},watch:{videoLink:function(){this.updateVideoId()}},computed:{keywordArray:function(){return this.keywords.split()},commentThreadsDisplay:function(){return this.filterCommentThread(this.commentThreads)}},methods:{queryComments:function(){this.keywords="",this.commentThreads=[],this.commentThreadsDummy=[],this.queryCompleted=!1,this.buildCommentThreadsApiRequest()},filterCommentThread:function(){var e=[];return this.keywords?(e=this.keywords.split(" "),this.commentThreads.length?this.commentThreads.filter(function(t){for(var n in e){var o=e[n];if(-1==t.text.indexOf(o))return!1}return!0}):[]):this.commentThreads},initCommentThreadsDisplay:function(){this.commentThreads=this.buildCommentThreadsObject(this.commentThreadsDummy),this.commentThreadsDisplay=this.filterCommentThread(this.commentThreads)},buildCommentThreadsObject:function(e){return e.map(function(e){var t=[];return e.replies&&e.replies.comments&&e.replies.comments.length&&(t=e.replies.comments.map(function(e){return{author:e.snippet.authorDisplayName,text:e.snippet.textOriginal,numLikes:e.snippet.likeCount,publishedAt:e.snippet.publishedAt.slice(0,10)}})),{author:e.snippet.topLevelComment.snippet.authorDisplayName,text:e.snippet.topLevelComment.snippet.textOriginal,numLikes:e.snippet.topLevelComment.snippet.likeCount,numReplies:e.snippet.totalReplyCount,publishedAt:e.snippet.topLevelComment.snippet.publishedAt.slice(0,10),replies:t}})},buildCommentThreadsApiRequest:function(e){var t=this,n=this,o=null;o=void 0==e?this.buildCommentThreadsApiParams():this.buildCommentThreadsApiParams(e),p.a.get(n.commentThreadsBaseUrl,{params:o}).then(function(e){var t=e.data;Array.prototype.push.apply(n.commentThreadsDummy,t.items),n.$notify({title:n.commentThreadsDummy.length+" Comments Retrieved.",type:"info"}),t.nextPageToken?(n.pageToken=t.nextPageToken,setTimeout(function(){n.buildCommentThreadsApiRequest(t.nextPageToken)},200)):(n.initCommentThreadsDisplay(),n.queryCompleted=!0,n.$notify({title:n.commentThreadsDummy.length+" Comments Retrieved in Total.",type:"success",duration:0}))}).catch(function(e){n.initCommentThreadsDisplay(),n.queryCompleted=!0,t.$notify({title:n.commentThreadsDummy.length+" Comments Retrieved in Total but with Errors.",type:"warning",duration:0}),console.log(e)})},buildCommentThreadsApiParams:function(e){return void 0==e&&(e=""),{videoId:this.videoId,maxResults:100,order:"relevance",part:"snippet,replies",key:"AIzaSyBpdhMIamKprhu9Z9f9sipUddNmNa0x5qs",pageToken:e}},updateVideoUrl:function(e){this.videoLink=this.youtubeBaseUrl+this.videoId},updateVideoId:function(e){this.videoId=this.getURLParam(this.videoLink,"v")},getURLParam:function(e,t){e||(e=window.location.href),t=t.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+t+"(=([^&#]*)|&|#|$)").exec(e);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}},mounted:function(){this.updateVideoId()}},u={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",{staticClass:"text-center"},[e._v("YouTube Video Comment Threads")]),e._v(" "),n("div",{staticStyle:{"margin-top":"30px"}},[n("el-input",{attrs:{placeholder:"Video Link"},model:{value:e.videoLink,callback:function(t){e.videoLink=t},expression:"videoLink"}},[n("template",{slot:"prepend"},[e._v("Video Link")]),e._v(" "),n("el-button",{attrs:{slot:"append",type:"primary",icon:"el-icon-search"},on:{click:e.queryComments},slot:"append"},[e._v("Start Query")])],2)],1),e._v(" "),n("el-form",{ref:"form-keyword",staticStyle:{"margin-top":"30px"},attrs:{"label-position":"'top'"}},[n("el-form-item",{attrs:{label:"Filter Comment Text by Keywords (Not Applied to Replys of Comment)"}},[n("el-tag",[e._v(e._s(e.commentThreadsDisplay.length)+" Comments")]),e._v(" "),n("el-input",{attrs:{placeholder:"seperate mutiple keywords by space, eg. game like"},model:{value:e.keywords,callback:function(t){e.keywords=t},expression:"keywords"}})],1)],1),e._v(" "),n("hr"),e._v(" "),e.queryCompleted?n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.commentThreadsDisplay,"default-sort":{prop:"likes",order:"descending"},border:"",height:"600"}},[n("el-table-column",{attrs:{type:"expand",label:"Replies",width:"90"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("h4",{staticClass:"text-center"},[e._v("Replys of Comment")]),e._v(" "),n("el-table",{staticStyle:{border:"1px solid gray"},attrs:{data:t.row.replies}},[n("el-table-column",{attrs:{prop:"author",label:"Author",sortable:"",width:"180"}}),e._v(" "),n("el-table-column",{attrs:{prop:"text",sortable:"",label:"Text"}}),e._v(" "),n("el-table-column",{attrs:{prop:"numLikes",label:"#Like",sortable:"",width:"120"}}),e._v(" "),n("el-table-column",{attrs:{prop:"publishedAt",label:"Publish Date",sortable:"",width:"160"}})],1)]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"author",label:"Author",sortable:"",width:"180"}}),e._v(" "),n("el-table-column",{attrs:{prop:"text",sortable:"",label:"Text"}}),e._v(" "),n("el-table-column",{attrs:{prop:"numLikes",label:"#Like",sortable:"",width:"120"}}),e._v(" "),n("el-table-column",{attrs:{prop:"numReplies",label:"#Reply",sortable:"",width:"120"}}),e._v(" "),n("el-table-column",{attrs:{prop:"publishedAt",label:"Publish Date",sortable:"",width:"160"}})],1):e._e()],1)},staticRenderFns:[]};var c=n("VU/8")(d,u,!1,function(e){n("Q/DC")},"data-v-cc5634b8",null).exports;o.default.use(l.a);var h=new l.a({routes:[{path:"/",name:"home",component:c},{path:"/Main",name:"Main",component:c}]});o.default.config.productionTip=!1,o.default.use(r.a),new o.default({el:"#app",router:h,render:function(e){return e(a)},components:{App:a},template:"<App/>"})},"Q/DC":function(e,t){},jzi9:function(e,t){},tvR6:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.a9a57e0f57ce8717957f.js.map