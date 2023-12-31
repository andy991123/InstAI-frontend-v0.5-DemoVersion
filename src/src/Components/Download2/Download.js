import React, { useState } from 'react';
import styles from'./Download.module.css';
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
import InstAI_icon from "../../image/instai_icon.png";


function Download2() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [username, setUsername] = useState("");  // 沒有使用到 
  const [filename, setFilename] = useState(""); 
  // 文件選擇
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);

    // 過濾文件
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const filteredFiles = fileArray.filter((file) =>
      allowedFileTypes.includes(file.type)
    );
   
    const fileNames = filteredFiles.map((file) => file.name);

    setFilename(fileNames);
    setSelectedFiles(filteredFiles);

    try {
      console.log('发送请求到URL:', 'http://localhost:8080/api/upload/download');//?filename=${filename}&username=${username}
      // const response = await fetch('http://localhost:8080/api/upload/download', {
      //   method: 'GET',
      //   body: formData,
      // });
      axios.get(`http://localhost:8080/api/upload/download?filename=${fileNames}&username=${id}`, { responseType: 'blob' })
        .then(response => {
          console.log(response.data);
          alert('download success')

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute("download",filename);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch(error => {
          console.error(error);
          console.error('文件上傳失敗');
        });
    } catch (error) {
      console.error('发生错误:', error);
    }

    const previews = filteredFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  // 文件下載 //modified
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file]));
    a.setAttribute("download", file.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 處理刪除單一圖片
  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1); 
    updatedPreviews.splice(index, 1); 

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // 刪除預覽
  const handleDeleteAllPreviews = () => {
    setImagePreviews([]);
    setSelectedFiles([]);
  };

  // 下載預覽 //modified
  const handleDownloadAll = () => {
    selectedFiles.forEach((file) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([file]));
      console.log(a.href)
      a.setAttribute("download", file.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleupload = async () => {
    const confirmDelete = window.confirm("確定要上傳圖片?");
    if (!confirmDelete) {
      return;
    }
    const uploaded = [...selectedFiles];
    const formData = new FormData();
    for(let i =0;i<uploaded.length;++i){
      formData.append('file', uploaded[i]);
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/upload/upload?username=${id}&projectname=${projectname}`, formData)
      .then(response => {
        console.log(response.data);
        // Handle success
        alert('upload success')
      })
      .catch(error => {
        console.error(error);
        // Handle error
      });
      console.log(response);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  return (
    <div className={styles.downloadBackground}>

      <div className='downloadTitleGrid'>
        
        <div className='downloadInstAIicon'>
          <img src={InstAI_icon} className={styles.downloadIcon} alt="Your Logo" />
        </div>
      
      </div>

      <div className={styles.downloadGridLine}></div>


      <div className={styles.downloadForm}>

      <h1 className={styles.downloadTitle}>UPLOAD/DOWNLOAD</h1>
      
        <div className={styles.downloadInputGrid}>

         <div className={styles.downloadInputGrid1}>
          <input type="file" className={styles.downloadInput} accept="image/*" multiple name="images" onChange={handleFileSelect} />
           </div>

           <div className={styles.downloadInputGrid2}>
            <button className={styles.downloadRemoveAll} onClick={handleDeleteAllPreviews}>Remove all</button>
            </div>

            <div className={styles.downloadInputGrid3}>
              <button className={styles.downloadAll} onClick={handleDownloadAll}>Download All</button>
            </div>

           <div className={styles.downloadInputGrid4}>
              <NavLink to={`/Step?id=${id}&project=${projectname}`}>
              <button className={styles.downloadSubmit} onClick={handleupload}>Done
              </button>
              </NavLink>
           </div>
          </div>
     

  
  
      </div>
      <div className={styles.downloadDiv} style={{ display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
        {imagePreviews.map((preview, index) => (
         
          <span key={index} className={styles.imgPreviews}  style={{marginLeft:'10px', marginBottom:'10px'}}>
            <img  
              src={preview}
              alt={`image ${index}`}
              style={{ width: '100px', height: '120px', top: '20px',marginTop:'20px',marginLeft:'20px' }}
            />
            <button className={styles.downloadDelete}  onClick={() => handleDeleteImage(index)}>刪除</button>
            <button className={styles.downloadSingleImg}  onClick={() => handleDownload(selectedFiles[index])}>Download</button>
          </span>

         
       
       
      
        ))}
      </div>
    </div>
  );
}

export default Download2;