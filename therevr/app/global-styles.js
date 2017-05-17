import { injectGlobal } from 'styled-components';
import FacebookLogo from 'images/facebook.jpg';
/* eslint-disable */
injectGlobal`
body {

}

.text-color{
  content: '';
}

.button-pulse {
  display: inline-block;
  ${''/* width: 150px;
  padding: 20px; */}
  text-align: center;
  font-weight: bold;
  text-decoration: none;
}

@keyframes pulse_animation {
  0% { transform: scale(1); }
  30% { transform: scale(1); }
  40% { transform: scale(1.08); }
  50% { transform: scale(1); }
  60% { transform: scale(1); }
  70% { transform: scale(1.05); }
  80% { transform: scale(1); }
  100% { transform: scale(1); }
}

.pulse {
  animation-name: pulse_animation;
  animation-duration: 5000ms;
  transform-origin:70% 70%;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.center-camera {
  margin-left: 120px;
}

.logo img{
  width: 15%;
  margin-bottom: 2%;
}

.loginContainer{
  margin: 5%;
}

.facebookContainer{
  margin: 5%;
  margin-bottom: 15%;
}

.topBarLogo img {
  width: 30%;
}

.logoName{
  color: #00aeef;
}

.footerCon{
  border-top: 1px solid #00aeef;
  color: black;
}

.footerLink{
  margin-bottom: 2%;
}

.footerLink a, .footerLink a:hover{
  color: black;
  text-decoration: none;
}

.footerLogo{
  color: grey;
}

.home-logo-container img {
  width: 15%;
}

.terms-logo-container img,
.privacy-logo-container img {
  width: 90px;
  cursor: pointer;
}

.centerImg {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.my-facebook-button-class{
  content: '';
  width: 40%;
  background: url(${FacebookLogo});
  background-size: contain;
  background-repeat: no-repeat;
  height: 60px;
  /* margin: 0 auto; */
  border: none;
}

@media (max-width: 768px){
  .my-facebook-button-class{
    width: 50%;
  }
}

@media (min-width: 1500px){
  .my-facebook-button-class{
    width: 30%;
  }
}

button.my-facebook-button-class, button.my-facebook-button-class:active{
  border: none;
}

.avatar-image{
  border-radius: 50%;
}

.bottom-line{
  border-bottom: 3px solid #00aeef;
  padding: 1% 0;
  display: flex;
}

.logoCenter{
  margin: auto;
}

.top-bar-avatar{
  padding-left: 3% !important;
}
.top-bar-avatar .text-center{
  float: left !important;
}


.top-bar-avatar .text-center a{
  display: flex;
}

.main-first-content{
  padding-top: 10%;
}

.top-bar-user-name{
  display: inline-block;
  margin-left: 20px;
}

.user-status img{
  width: 20px;
  margin-left: -20px;
  margin-top: 40px;
}

.side-bar{
  height: 100%;
  position: absolute !important;
}

.right-line{
  border-right: 2px solid #00aeef;
  height: 170%;
}

.p-10{
  padding: 10px !important;
}

.p-20{
  padding: 20px !important;
}

.p-30{
  padding: 30px !important;
}

.p-40{
  padding: 40px !important;
}

.p-8-x-rf-per{
 padding: 8% !important;
}

.p-5-x-rf-per{
 // padding: 5% !important;
}

.p-t-1{
  padding-top: 1% !important;
}

.p-t-2{
  padding-top: 2% !important;
}

.p-10-x-rf{
  padding: 10px 0 !important;
}

.p-20-x-rf{
  padding: 20px 0 !important;
}

.p-30-x-rf{
  padding: 30px 0 !important;
}

.p-40-x-rf{
  padding: 40px 0 !important;
}


.m-10{
  margin: 10px !important;
}

.m-20{
  margin: 20px !important;
}

.m-30{
  margin: 30px !important;
}

.m-40{
  margin: 40px !important;
}

.main-page{
  margin: auto;
}

.go-there-button{
  background: #00aeef;
  color: white;
  text-decoration: none;
}

a.go-there-button:hover{
  color: white;
  text-decoration: none;
}

.go-there-button span{
    background: #00aeef;
    font-size: 1em;
    padding: 1.5% 4%;
    /* border-radius: 30%; */
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    font-weight: normal;
}

.go-there-end{
  background: tomato;
  color: white;
  text-decoration: none;
}

a.go-there-end:hover{
  color: white;
  text-decoration: none;
}

.go-end-button span{
    cursor: pointer;
    color: white;
    background: tomato;
    font-size: 1em;
    padding: 1.5% 4%;
    /* border-radius: 30%; */
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    font-weight: normal;
}

.top-bar-user-name label{
  color: grey;
}

 a.log-out-button, a.log-out-button:hover{
  color: white;
  text-decoration: none;
}

.log-out-button span{
    background: #00aeef;
    font-size: 20px;
    padding: 13px 40px;
    /* border-radius: 30%; */
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    font-weight: normal;
}

a.invite-friend-button, a.invite-friend-button:hover{
  color: white;
  text-decoration: none;
}


.invite-friend-button span{
    background: #00aeef;
    font-size: 15px;
    padding: 10px 20px;
    /* border-radius: 30%; */
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    font-weight: normal;
}

.blueColor{
  color: #00aeef;
  margin-right: 2%;
}

.profile-content{
  // display: flex;
}

.right-black-line{
  border-right: 1px black solid;
}

.user-camera img{
    margin-top: -5%;
    width: 15%;
}

.user-camera-status img{

}

.user-list-content{
    padding-top: 5%;
    padding-left: 10%;
}

.user-list-status img{
    margin-top: -20%;
    margin-left: 37%;
    width: 30px;
}

.under-name{
  color: black;
}

.under-name i{
 color: grey;
}


.avatar-div{
  display: inline-block;
}

.main-first-content .row.select-user{
  margin-top: -8%;
  padding: 0 15%;
}

.main-first-content .row.select-user .text-center a{
  display: flex;
}

.main-first-content .row.select-user .text-center a .avatar-div{
  display: inline-block;
  margin: auto 0;
}


.col-sm-5.right-black-line.p-t-2 .text-center .avatar-div{
  display: block;
}

.selectAll{
    background: #00aeef;
    font-size: 15px;
    padding: 7px 20px;
    /* border-radius: 30%; */
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    font-weight: normal;
    color: white;
}

a.selectAll:focus, a.selectAll:hover, a.selectAll:active, a.selectAll:visited{
  color: white;
  text-decoration: none;
}

.unSelectAll{
  color: #00aeef;
  font-size: 15px;
}

.all-online-content{
  padding: 2%;
  // margin-left: 90px;
  border-bottom: 1px solid #00aeef;

}

.contacts-bar-content {
  display: inline-block;
  margin: 0 2%;
  margin-top: 10px;
}

${''/* .all-online-content div a{
  z-index: 1000;
} */}

@media (min-width: 1441px){

  .right-line{
    width: 40% !important;
  }

  .right-line .p-10-x-rf{
    margin-left: -20px;
  }

   ${''/* .all-online-content{
    margin-left: 7%;
   } */}
}

@media (min-width: 1560px){

  ${''/* .all-online-content{
    margin-left: 5.5%;
   } */}

  .right-line{
    width: 30% !important;
  }

  .right-line .p-10-x-rf{
    margin-left: -20px;
  }
}


@media (min-width: 2020px){

  ${''/* .all-online-content{
    margin-left: 4%;
   } */}

  .right-line{
    width: 25% !important;
  }

  .right-line .p-10-x-rf{
    margin-left: -20px;
  }
}


@media (min-width: 2380px){

  ${''/* .all-online-content{
    margin-left: 3.5%;
   } */}
  .right-line{
    width: 20% !important;
  }

  .right-line .p-10-x-rf{
    margin-left: -20px;
  }
}

@media (max-width: 1440px){
  ${''/* .all-online-content {
      padding: 2%;
      padding-left: 3%;
      border-bottom: 1px solid #00aeef;
      margin-left: 8.5%;
  } */}
}

@media (max-width: 1024px){
/*  .top-bar-user-name{
    position: absolute;
    margin: -17% 25%;
  }*/

  .right-line{
    width: 66.6666666% !important;
    ${''/* height: 93vh; */}
  }

  .logoCenter .col-sm-9.col-xs-12 img{
    width: 15%;
  }

  .logoCenter .col-sm-3.col-xs-12 a img{
    width: 80%;
  }
}


@media (max-width: 768px){
/*  .top-bar-user-name{
    margin: -22% 32%;
    width: 100%;
  }
*/
  .col-sm-5.right-black-line.p-t-2 .text-center .avatar-div .avatar-image{
    width: 70%;
    height: 70%;
  }

  .main-first-content .row.select-user{
    padding: 0 20%;
  }
  .right-line{
    width: 100% !important;
  }

  .p-5-x-rf-per.profile-content .text-center .avatar-div{
    text-align: right;
  }

  .p-5-x-rf-per.profile-content .text-center span.user-camera img{
    margin-left: 35%;
  }

  .col-sm-7.p-t-2 .row.p-10-x-rf div{
    margin-left: 0;
  }

  .col-sm-7.p-t-2 .row .col-sm-7{
    width: 90%;
  }

  ${''/* .all-online-content{
    margin-left: 14.5%;
  } */}
}

@media (max-width: 425px){
  .main-page{
    margin-left: 30%;
  }

  .main-page .p-40 img{
    width: 30%;
  }

  .col-xs-2.text-center.logoCenter img{
    width: 150%;
  }

  .text-right.logoCenter .col-xs-12{
    text-align: center;
    margin: 20% 20% 20% 0;
  }

  .side-bar {
    height: 160%;
  }

  .top-bar-avatar .text-center a {
    display: block;
  }

   .avatar-div{
    display: block;
   }
  .top-bar-user-name{
    display: block;
    text-align: center !important;
    margin-left: 0;
    padding: 2%;
  }

  .col-sm-2.col-xs-4.text-center.logoCenter img{
    width: 50%;
  }

  .col-sm-5.col-xs-4.text-right.logoCenter .col-sm-9 img{
    width: 50%;
  }

  .col-sm-5.col-xs-4.text-right.logoCenter .col-sm-3 img{
    width: 60%;
  }

  .main-page{
    padding-left: 30%;
  }

  .col-sm-3.side-bar{
    width: 25%;
  }

  .main-first-content .row.select-user{
    padding-left: 40%;
    padding-right: 0;
  }

  .p-5-x-rf-per.profile-content{
    display: block;
  }

  .p-5-x-rf-per.profile-content .col-sm-7.p-t-2{
    display: block;
    margin-left: 30%;
  }

  .p-5-x-rf-per.profile-content .col-sm-5.right-black-line.p-t-2{
    border: none;
  }

  .col-sm-7.p-t-2 .row .col-sm-7 span{
    display: block;
  }

  ${''/* .all-online-content{
    margin-left: 30%;
    padding: 4%;

  } */}
  .right-line.col-sm-6.text-center{
    height: 200%;
  }

  .right-line.col-sm-6.text-center .p-10-x-rf .col-sm-4.p-20 .text-center a .avatar-div .user-status img{
    width: 20px;
    margin-left: 30px;
    margin-top: -30px;
  }
/*  .avatar-image{
    width: 70%;
    height: 70%;
  }*/
}

@media (max-width: 375px){
  .col-sm-3.side-bar{
    width: 30%;
  }

  .top-bar-user-name{
    padding: 0;
  }

}

@media (max-width: 320px){
  .p-10-x-rf .text-center .avatar-div .user-status img{
    margin-top: -30px;
    margin-left: 30px;
  }

  .right-line.col-sm-6.text-center{
    height: 200%;
  }

  .right-line .p-10-x-rf{
        margin-left: -20px;
  }
}


a, a:hover, a:active, a:visited{
  text-decoration: none;
}

.upload-file {
  ${''/* background: url("http://ichef.bbci.co.uk/news/660/cpsprodpb/37B5/production/_89716241_thinkstockphotos-523060154.jpg"); */}
   border: 0;
   height: 200px;
   font-size:14pt;
   cursor: pointer;
   display: block;
   position: absolute;
   bottom: 100px;
   z-index: 9999;
   opacity: 0;
}

.set-status-image{
  z-index: 1000;
  width: 20px;
  height: 20px;
}

.image-button{
  padding: 0 !important;
  border-radius: 50% !important;
  width: 22px !important;
  height: 22px !important;
  margin-left: -15px !important;
  margin-top: 40px !important;
  border: 0 !important;
  z-index: 10000;
}

#popover-trigger-focus{
  left: 8% !important;
  top: 8% !important;
}

#popover-trigger-focus .arrow{
  border-style: none;
  top: 0;
}

.popover-content{
  padding: 9px !important;
}

.popover-content > div{
  min-width: 171px;
}

.popover-content div{
  padding: 7px;
}

.popover-content div img{
  width: 20px;
}

.checked{
  display: inline-block !important;
}

.unChecked{
  display: none !important;
}

#limitAlert .modal-dialog{
  width:  25% !important;
  text-align: center;
}

#limitAlert .modal-footer{
 text-align: center !important;
}

#limitAlert .fade.in.modal{
  display: block;
  margin: auto;
  height: 100%;
  top: 50%;
}

#inviteFriends .modal-header{
  border-bottom: none;
}

#inviteFriends .modal-footer{
  border-top: none;
}

#inviteFriends .modal-footer div{
  display: flex;
  margin-bottom: 20px;
}

#inviteFriends .fade.in.modal{
  display: block;
  margin: auto;
  height: 100%;
  top: 30%;
}

.friends-list-component{
  display: flex;
  margin: 10px;
}

.friends-list-component div.col-xs-7{
  display: flex;
}

.friends-list-component div.col-xs-7 span{
  margin: auto 0;
}

.friends-list-component img{
  width: 60px;
  height: 60px;
}

.friends-list-component div.check-box-content{
  display: flex;
}

.friends-list-component div.check-box-content div.checkbox{
  margin: auto;
}

.checkbox-custom {
    opacity: 0;
    position: absolute;
}

.checkbox-custom, .checkbox-custom-label {
    display: inline-block;
    vertical-align: middle;
    margin: 5px;
    cursor: pointer;
}

.checkbox-custom-label {
    margin: auto;
    border-radius: 50%;
    border: none;
    outline: 0 !important;
    position: relative;
}

.checkbox-custom + .checkbox-custom-label:before {
    content: '';
    background: #dddddd;
    border: 2px solid #ddd;
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    padding: 2px;
    margin-right: 10px;
    text-align: center;
    border-radius: 50%;
}

.checkbox-custom:checked + .checkbox-custom-label:before {
    background: #00aeef;
    border-color: #00aeef
}

.checkbox-custom:focus + .checkbox-custom-label {
  outline: 1px solid #ddd; /* focus style */
}


.modal-action-a{
  content: '';
  margin: 0 auto;
  margin-left: 35% !important;
}

.modal-action-b{
  content: '';
  margin-top: 5px;
}

.invite-sent{
  text-align: center;
}

.invite-sent p{
  color: #00ca77;
  font-size: 20px;
  padding: 20px;
}

@media (max-width: 425px) {
  #inviteFriends .modal-footer div {
      margin-bottom: 20px;
      text-align: center;
      display: block;
  }

  #inviteFriends .modal-footer div a{
      margin: 10px auto !important;
      display: block;
  }

  #inviteFriends .modal-footer div a.modal-action-b{
      margin-top: 30px !important;
  }
}

.title {
  color: red;
}

`;