<template>
  <div id="footer">
      <div>
            <h1>TIME WRITE</h1>
      </div>
      <div id="contact">
          <ul>
              <li><a href="https://www.facebook.com/truongvu264/">Facebook</a></li>
              <li><a href="#">Youtube</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Twiter</a></li>
              <li><a href="#">Tiktok</a></li>
          </ul>
      </div>
      <div id="no-copy">
          <h5>	&copy; 2021</h5>
      </div>
  </div>
</template>

<script>
export default {
    
}
</script>

import network from '../core/network'
<style scoped>
        #footer {
            height: 200px;
            width: 100%;
            background: black;
        }
        h1 {
            color: white;
           text-align: center;
           margin: 20px;
        }
        #contact ul {
            display: flex;
            color: white;
            justify-content: center;
            margin: 40px;
        }
        #contact ul {
            display: flex;
            color: white;
            justify-content: center;
            margin: 10px;
        }
        #contact ul li {
            margin: 0px 40px;
        }
        #contact ul li a {
                text-decoration: none;
                list-style: none;
                color: white;
            }
        #no-copy {
            text-align: center;
            color: white;
        }

    @media (max-width: 900px){
        #footer {
            height: 150px;
            width: 100%;
            background: black;
        }
        h1 {
           margin: 5px 0px;
           font-size: 16px;
           padding-top: 40px;
        }
        #contact ul li {
            margin: 0px 10px;
            font-size: 14px;
        }
    }
    @media (max-width: 600px){
        #footer {
            height: 100px;
            width: 100%;
            background: black;
        }
        h1 {
           margin: 5px 0px;
           font-size: 15px;
           padding-top: 20px;
        }
        #contact ul li {
            margin: 0px 10px;
            font-size: 12px;
        }
        #no-copy h5{
            text-align: center;
            color: white;
            font-size: 14px;
        }
    }


</style>