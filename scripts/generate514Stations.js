import fs from 'fs';
import path from 'path';

// Complete list of 514 Kabupaten & Kota across all 38 provinces in Indonesia
const PROVINCES_DATA = [
  // 1. Aceh (23)
  {
    province: 'Aceh',
    items: [
      { name: 'Kota Banda Aceh', lat: 5.5483, lng: 95.3238, river: 'Krueng Aceh', das: 'DAS Aceh' },
      { name: 'Kota Sabang', lat: 5.8933, lng: 95.3164, river: 'Krueng Pria Laot', das: 'DAS Weh' },
      { name: 'Kota Lhokseumawe', lat: 5.1801, lng: 97.1507, river: 'Krueng Cunda', das: 'DAS Pase' },
      { name: 'Kota Langsa', lat: 4.4727, lng: 97.9646, river: 'Krueng Langsa', das: 'DAS Langsa' },
      { name: 'Kota Subulussalam', lat: 2.6416, lng: 98.0053, river: 'Lae Souraya', das: 'DAS Singkil' },
      { name: 'Kabupaten Aceh Selatan', lat: 3.2842, lng: 97.3524, river: 'Krueng Kluet', das: 'DAS Kluet' },
      { name: 'Kabupaten Aceh Tenggara', lat: 3.4833, lng: 97.8167, river: 'Lae Alas', das: 'DAS Alas' },
      { name: 'Kabupaten Aceh Timur', lat: 4.8833, lng: 97.6833, river: 'Krueng Arakundo', das: 'DAS Arakundo' },
      { name: 'Kabupaten Aceh Tengah', lat: 4.5000, lng: 96.8500, river: 'Krueng Peusangan', das: 'DAS Peusangan' },
      { name: 'Kabupaten Aceh Barat', lat: 4.2500, lng: 96.0833, river: 'Krueng Meureubo', das: 'DAS Meureubo' },
      { name: 'Kabupaten Aceh Besar', lat: 5.3833, lng: 95.4833, river: 'Krueng Aceh', das: 'DAS Aceh' },
      { name: 'Kabupaten Pidie', lat: 5.2667, lng: 95.9500, river: 'Krueng Baro', das: 'DAS Baro' },
      { name: 'Kabupaten Bireuen', lat: 5.1000, lng: 96.6000, river: 'Krueng Peusangan', das: 'DAS Peusangan' },
      { name: 'Kabupaten Aceh Utara', lat: 4.9500, lng: 97.1000, river: 'Krueng Keureuto', das: 'DAS Keureuto' },
      { name: 'Kabupaten Aceh Barat Daya', lat: 3.8333, lng: 96.8667, river: 'Krueng Babahrot', das: 'DAS Babahrot' },
      { name: 'Kabupaten Gayo Lues', lat: 3.9667, lng: 97.3500, river: 'Lae Alas', das: 'DAS Alas' },
      { name: 'Kabupaten Aceh Tamiang', lat: 4.2500, lng: 98.0500, river: 'Krueng Tamiang', das: 'DAS Tamiang' },
      { name: 'Kabupaten Nagan Raya', lat: 4.2000, lng: 96.4000, river: 'Krueng Tripa', das: 'DAS Tripa' },
      { name: 'Kabupaten Aceh Jaya', lat: 4.7500, lng: 95.7000, river: 'Krueng Teunom', das: 'DAS Teunom' },
      { name: 'Kabupaten Bener Meriah', lat: 4.7333, lng: 96.8833, river: 'Krueng Wih Pesam', das: 'DAS Peusangan' },
      { name: 'Kabupaten Pidie Jaya', lat: 5.1500, lng: 96.2000, river: 'Krueng Meureudu', das: 'DAS Meureudu' },
      { name: 'Kabupaten Simeulue', lat: 2.6167, lng: 96.0833, river: 'Krueng Simeulue', das: 'DAS Simeulue' },
      { name: 'Kabupaten Aceh Singkil', lat: 2.3333, lng: 97.8333, river: 'Lae Cinendang', das: 'DAS Singkil' },
    ]
  },
  // 2. Sumatera Utara (33)
  {
    province: 'Sumatera Utara',
    items: [
      { name: 'Kota Medan', lat: 3.5952, lng: 98.6722, river: 'Sungai Deli', das: 'DAS Deli' },
      { name: 'Kota Pematangsiantar', lat: 2.9583, lng: 99.0667, river: 'Sungai Bah Bolon', das: 'DAS Bah Bolon' },
      { name: 'Kota Sibolga', lat: 1.7417, lng: 98.7833, river: 'Sungai Doras', das: 'DAS Sibolga' },
      { name: 'Kota Tanjungbalai', lat: 2.9667, lng: 99.8000, river: 'Sungai Asahan', das: 'DAS Asahan' },
      { name: 'Kota Binjai', lat: 3.6000, lng: 98.4833, river: 'Sungai Bingai', das: 'DAS Bingai' },
      { name: 'Kota Tebing Tinggi', lat: 3.3283, lng: 99.1625, river: 'Sungai Padang', das: 'DAS Padang' },
      { name: 'Kota Padang Sidempuan', lat: 1.3733, lng: 99.2733, river: 'Sungai Batang Ayumi', das: 'DAS Ayumi' },
      { name: 'Kota Gunungsitoli', lat: 1.2833, lng: 97.6167, river: 'Sungai Nou', das: 'DAS Nias' },
      { name: 'Kabupaten Asahan', lat: 2.9833, lng: 99.6333, river: 'Sungai Silau', das: 'DAS Asahan' },
      { name: 'Kabupaten Batubara', lat: 3.1667, lng: 99.5333, river: 'Sungai Dalu-dalu', das: 'DAS Batubara' },
      { name: 'Kabupaten Dairi', lat: 2.7333, lng: 98.3167, river: 'Sungai Lae Renun', das: 'DAS Renun' },
      { name: 'Kabupaten Deli Serdang', lat: 3.5500, lng: 98.8667, river: 'Sungai Percut', das: 'DAS Percut' },
      { name: 'Kabupaten Humbang Hasundutan', lat: 2.2667, lng: 98.7000, river: 'Sungai Aek Sibundong', das: 'DAS Sibundong' },
      { name: 'Kabupaten Karo', lat: 3.1167, lng: 98.5000, river: 'Sungai Lau Borus', das: 'DAS Wampu' },
      { name: 'Kabupaten Labuhanbatu', lat: 2.2667, lng: 100.0833, river: 'Sungai Bilah', das: 'DAS Bilah' },
      { name: 'Kabupaten Labuhanbatu Selatan', lat: 1.9500, lng: 100.1000, river: 'Sungai Barumun', das: 'DAS Barumun' },
      { name: 'Kabupaten Labuhanbatu Utara', lat: 2.3333, lng: 99.6333, river: 'Sungai Kualuh', das: 'DAS Kualuh' },
      { name: 'Kabupaten Langkat', lat: 3.7500, lng: 98.2500, river: 'Sungai Wampu', das: 'DAS Wampu' },
      { name: 'Kabupaten Mandailing Natal', lat: 0.8667, lng: 99.5500, river: 'Sungai Batang Gadis', das: 'DAS Batang Gadis' },
      { name: 'Kabupaten Nias', lat: 1.0500, lng: 97.7500, river: 'Sungai Gido', das: 'DAS Nias' },
      { name: 'Kabupaten Nias Barat', lat: 1.0333, lng: 97.4667, river: 'Sungai Oyo', das: 'DAS Oyo' },
      { name: 'Kabupaten Nias Selatan', lat: 0.7667, lng: 97.7500, river: 'Sungai Mezaya', das: 'DAS Mezaya' },
      { name: 'Kabupaten Nias Utara', lat: 1.3333, lng: 97.3167, river: 'Sungai Muzoi', das: 'DAS Muzoi' },
      { name: 'Kabupaten Padang Lawas', lat: 1.3333, lng: 99.8500, river: 'Sungai Barumun', das: 'DAS Barumun' },
      { name: 'Kabupaten Padang Lawas Utara', lat: 1.4833, lng: 99.6667, river: 'Sungai Batang Pane', das: 'DAS Pane' },
      { name: 'Kabupaten Pakpak Bharat', lat: 2.5667, lng: 98.2833, river: 'Sungai Lae Kombih', das: 'DAS Kombih' },
      { name: 'Kabupaten Samosir', lat: 2.6333, lng: 98.7167, river: 'Danau Toba Inflow', das: 'DAS Toba' },
      { name: 'Kabupaten Serdang Bedagai', lat: 3.4167, lng: 99.0833, river: 'Sungai Ular', das: 'DAS Ular' },
      { name: 'Kabupaten Simalungun', lat: 2.9667, lng: 99.0333, river: 'Sungai Bah Kisat', das: 'DAS Bah Bolon' },
      { name: 'Kabupaten Tapanuli Selatan', lat: 1.5000, lng: 99.2500, river: 'Sungai Batang Toru', das: 'DAS Batang Toru' },
      { name: 'Kabupaten Tapanuli Tengah', lat: 1.8833, lng: 98.6667, river: 'Sungai Sibuluan', das: 'DAS Sibuluan' },
      { name: 'Kabupaten Tapanuli Utara', lat: 2.0000, lng: 98.9667, river: 'Sungai Aek Sigeaon', das: 'DAS Sigeaon' },
      { name: 'Kabupaten Toba', lat: 2.3833, lng: 99.2167, river: 'Sungai Asahan Hulu', das: 'DAS Asahan' },
    ]
  },
  // 3. Sumatera Barat (19)
  {
    province: 'Sumatera Barat',
    items: [
      { name: 'Kota Padang', lat: -0.9471, lng: 100.4172, river: 'Sungai Batang Arau', das: 'DAS Batang Arau' },
      { name: 'Kota Solok', lat: -0.7989, lng: 100.6539, river: 'Batang Lembang', das: 'DAS Lembang' },
      { name: 'Kota Sawahlunto', lat: -0.6800, lng: 100.7800, river: 'Batang Ombilin', das: 'DAS Ombilin' },
      { name: 'Kota Padang Panjang', lat: -0.4639, lng: 100.4000, river: 'Batang Anai Hulu', das: 'DAS Anai' },
      { name: 'Kota Bukittinggi', lat: -0.3056, lng: 100.3694, river: 'Ngarai Sianok', das: 'DAS Masang' },
      { name: 'Kota Payakumbuh', lat: -0.2239, lng: 100.6308, river: 'Batang Agam', das: 'DAS Agam' },
      { name: 'Kota Pariaman', lat: -0.6256, lng: 100.1206, river: 'Batang Mangau', das: 'DAS Mangau' },
      { name: 'Kabupaten Agam', lat: -0.2500, lng: 100.1667, river: 'Batang Antokan', das: 'DAS Antokan' },
      { name: 'Kabupaten Dharmasraya', lat: -1.0500, lng: 101.6167, river: 'Batang Hari', das: 'DAS Batanghari' },
      { name: 'Kabupaten Kepulauan Mentawai', lat: -2.1333, lng: 99.6500, river: 'Sungai Siberut', das: 'DAS Mentawai' },
      { name: 'Kabupaten Lima Puluh Kota', lat: -0.1333, lng: 100.6167, river: 'Batang Sinamar', das: 'DAS Sinamar' },
      { name: 'Kabupaten Padang Pariaman', lat: -0.6000, lng: 100.2833, river: 'Batang Anai', das: 'DAS Anai' },
      { name: 'Kabupaten Pasaman', lat: 0.3500, lng: 100.1000, river: 'Batang Pasaman', das: 'DAS Pasaman' },
      { name: 'Kabupaten Pasaman Barat', lat: 0.1833, lng: 99.8167, river: 'Batang Kinali', das: 'DAS Kinali' },
      { name: 'Kabupaten Pesisir Selatan', lat: -1.3500, lng: 100.5667, river: 'Batang Tarusan', das: 'DAS Tarusan' },
      { name: 'Kabupaten Sijunjung', lat: -0.6833, lng: 101.3000, river: 'Batang Kuantan', das: 'DAS Kuantan' },
      { name: 'Kabupaten Solok', lat: -0.9833, lng: 100.7500, river: 'Danau Singkarak Inflow', das: 'DAS Ombilin' },
      { name: 'Kabupaten Solok Selatan', lat: -1.5000, lng: 101.2500, river: 'Batang Sangir', das: 'DAS Sangir' },
      { name: 'Kabupaten Tanah Datar', lat: -0.4500, lng: 100.5833, river: 'Batang Selo', das: 'DAS Ombilin' },
    ]
  },
  // 4. Riau (12)
  {
    province: 'Riau',
    items: [
      { name: 'Kota Pekanbaru', lat: 0.5333, lng: 101.4474, river: 'Sungai Siak', das: 'DAS Siak' },
      { name: 'Kota Dumai', lat: 1.6667, lng: 101.4500, river: 'Sungai Dumai', das: 'DAS Dumai' },
      { name: 'Kabupaten Bengkalis', lat: 1.4833, lng: 102.1333, river: 'Sungai Bengkalis', das: 'DAS Siak' },
      { name: 'Kabupaten Indragiri Hilir', lat: -0.3333, lng: 103.1667, river: 'Sungai Indragiri Hilir', das: 'DAS Indragiri' },
      { name: 'Kabupaten Indragiri Hulu', lat: -0.5500, lng: 102.3167, river: 'Sungai Indragiri Hulu', das: 'DAS Indragiri' },
      { name: 'Kabupaten Kampar', lat: 0.3333, lng: 101.0333, river: 'Sungai Kampar', das: 'DAS Kampar' },
      { name: 'Kabupaten Kepulauan Meranti', lat: 1.0000, lng: 102.7167, river: 'Selat Rangsang', das: 'DAS Meranti' },
      { name: 'Kabupaten Kuantan Singingi', lat: -0.5333, lng: 101.4500, river: 'Sungai Kuantan', das: 'DAS Kuantan' },
      { name: 'Kabupaten Pelalawan', lat: 0.2833, lng: 102.0000, river: 'Sungai Kampar Hilir', das: 'DAS Kampar' },
      { name: 'Kabupaten Rokan Hilir', lat: 2.1667, lng: 100.8167, river: 'Sungai Rokan Hilir', das: 'DAS Rokan' },
      { name: 'Kabupaten Rokan Hulu', lat: 0.8833, lng: 100.5167, river: 'Sungai Rokan Kiri', das: 'DAS Rokan' },
      { name: 'Kabupaten Siak', lat: 0.8000, lng: 101.9833, river: 'Sungai Siak', das: 'DAS Siak' },
    ]
  },
  // 5. Kepulauan Riau (7)
  {
    province: 'Kepulauan Riau',
    items: [
      { name: 'Kota Batam', lat: 1.1301, lng: 104.0529, river: 'Waduk Duriangkang', das: 'DAS Batam' },
      { name: 'Kota Tanjungpinang', lat: 0.9167, lng: 104.4500, river: 'Sungai Jang', das: 'DAS Bintan' },
      { name: 'Kabupaten Bintan', lat: 1.0500, lng: 104.5333, river: 'Sungai Bintan', das: 'DAS Bintan' },
      { name: 'Kabupaten Karimun', lat: 0.9833, lng: 103.4333, river: 'Sungai Raya', das: 'DAS Karimun' },
      { name: 'Kabupaten Kepulauan Anambas', lat: 3.2167, lng: 106.2500, river: 'Sungai Tarempa', das: 'DAS Anambas' },
      { name: 'Kabupaten Lingga', lat: -0.2000, lng: 104.6167, river: 'Sungai Daik', das: 'DAS Lingga' },
      { name: 'Kabupaten Natuna', lat: 3.9500, lng: 108.3833, river: 'Sungai Ranai', das: 'DAS Natuna' },
    ]
  },
  // 6. Jambi (11)
  {
    province: 'Jambi',
    items: [
      { name: 'Kota Jambi', lat: -1.6100, lng: 103.6100, river: 'Sungai Batanghari', das: 'DAS Batanghari' },
      { name: 'Kota Sungai Penuh', lat: -2.0667, lng: 101.4000, river: 'Sungai Marao', das: 'DAS Batang Merangin' },
      { name: 'Kabupaten Batanghari', lat: -1.7500, lng: 103.1167, river: 'Sungai Batanghari', das: 'DAS Batanghari' },
      { name: 'Kabupaten Bungo', lat: -1.5000, lng: 101.9667, river: 'Batang Bungo', das: 'DAS Batanghari' },
      { name: 'Kabupaten Kerinci', lat: -2.1000, lng: 101.5000, river: 'Danau Kerinci Inflow', das: 'DAS Merangin' },
      { name: 'Kabupaten Merangin', lat: -2.2500, lng: 102.1667, river: 'Batang Merangin', das: 'DAS Merangin' },
      { name: 'Kabupaten Muaro Jambi', lat: -1.5333, lng: 103.8167, river: 'Batang Kumpeh', das: 'DAS Batanghari' },
      { name: 'Kabupaten Sarolangun', lat: -2.3000, lng: 102.6500, river: 'Batang Tembesi', das: 'DAS Tembesi' },
      { name: 'Kabupaten Tanjung Jabung Barat', lat: -1.1333, lng: 103.3500, river: 'Sungai Pengabuan', das: 'DAS Pengabuan' },
      { name: 'Kabupaten Tanjung Jabung Timur', lat: -1.1500, lng: 103.8500, river: 'Muara Batanghari', das: 'DAS Batanghari' },
      { name: 'Kabupaten Tebo', lat: -1.4500, lng: 102.4333, river: 'Batang Tebo', das: 'DAS Batanghari' },
    ]
  },
  // 7. Sumatera Selatan (17)
  {
    province: 'Sumatera Selatan',
    items: [
      { name: 'Kota Palembang', lat: -2.9909, lng: 104.7565, river: 'Sungai Musi', das: 'DAS Musi' },
      { name: 'Kota Pagar Alam', lat: -4.0167, lng: 103.2667, river: 'Sungai Lematang Hulu', das: 'DAS Musi' },
      { name: 'Kota Lubuklinggau', lat: -3.2950, lng: 102.8617, river: 'Sungai Kelingi', das: 'DAS Musi' },
      { name: 'Kota Prabumulih', lat: -3.4333, lng: 104.2333, river: 'Sungai Kelekar', das: 'DAS Kelekar' },
      { name: 'Kabupaten Banyuasin', lat: -2.8833, lng: 104.3833, river: 'Sungai Banyuasin', das: 'DAS Banyuasin' },
      { name: 'Kabupaten Empat Lawang', lat: -3.7500, lng: 103.0000, river: 'Sungai Musi Hulu', das: 'DAS Musi' },
      { name: 'Kabupaten Lahat', lat: -3.7833, lng: 103.5333, river: 'Sungai Lematang', das: 'DAS Musi' },
      { name: 'Kabupaten Muara Enim', lat: -3.6500, lng: 103.7833, river: 'Sungai Enim', das: 'DAS Musi' },
      { name: 'Kabupaten Musi Banyuasin', lat: -2.5500, lng: 103.8500, river: 'Sungai Musi Tengah', das: 'DAS Musi' },
      { name: 'Kabupaten Musi Rawas', lat: -3.1833, lng: 103.0167, river: 'Sungai Rawas', das: 'DAS Musi' },
      { name: 'Kabupaten Musi Rawas Utara', lat: -2.8333, lng: 102.9000, river: 'Sungai Rupit', das: 'DAS Musi' },
      { name: 'Kabupaten Ogan Ilir', lat: -3.3833, lng: 104.6667, river: 'Sungai Ogan', das: 'DAS Musi' },
      { name: 'Kabupaten Ogan Komering Ilir', lat: -3.4000, lng: 105.0000, river: 'Sungai Komering Hilir', das: 'DAS Musi' },
      { name: 'Kabupaten Ogan Komering Ulu', lat: -4.1333, lng: 104.1667, river: 'Sungai Ogan Hulu', das: 'DAS Musi' },
      { name: 'Kabupaten Ogan Komering Ulu Selatan', lat: -4.6667, lng: 104.0000, river: 'Danau Ranau Inflow', das: 'DAS Musi' },
      { name: 'Kabupaten Ogan Komering Ulu Timur', lat: -3.8500, lng: 104.7500, river: 'Sungai Belitang', das: 'DAS Musi' },
      { name: 'Kabupaten Penukal Abab Lematang Ilir', lat: -3.2167, lng: 103.8333, river: 'Sungai Penukal', das: 'DAS Musi' },
    ]
  },
  // 8. Kepulauan Bangka Belitung (7)
  {
    province: 'Kepulauan Bangka Belitung',
    items: [
      { name: 'Kota Pangkalpinang', lat: -2.1333, lng: 106.1167, river: 'Sungai Rangkui', das: 'DAS Rangkui' },
      { name: 'Kabupaten Bangka', lat: -1.9000, lng: 105.9000, river: 'Sungai Baturusa', das: 'DAS Baturusa' },
      { name: 'Kabupaten Bangka Barat', lat: -1.7500, lng: 105.4167, river: 'Sungai Muntok', das: 'DAS Muntok' },
      { name: 'Kabupaten Bangka Selatan', lat: -2.8500, lng: 106.2833, river: 'Sungai Kepoh', das: 'DAS Kepoh' },
      { name: 'Kabupaten Bangka Tengah', lat: -2.4000, lng: 106.1833, river: 'Sungai Kurau', das: 'DAS Kurau' },
      { name: 'Kabupaten Belitung', lat: -2.7500, lng: 107.6500, river: 'Sungai Cerucuk', das: 'DAS Cerucuk' },
      { name: 'Kabupaten Belitung Timur', lat: -2.9833, lng: 108.1500, river: 'Sungai Lenggang', das: 'DAS Lenggang' },
    ]
  },
  // 9. Bengkulu (10)
  {
    province: 'Bengkulu',
    items: [
      { name: 'Kota Bengkulu', lat: -3.8004, lng: 102.2655, river: 'Sungai Air Bengkulu', das: 'DAS Bengkulu' },
      { name: 'Kabupaten Bengkulu Selatan', lat: -4.4667, lng: 102.9167, river: 'Sungai Air Manna', das: 'DAS Manna' },
      { name: 'Kabupaten Bengkulu Tengah', lat: -3.7500, lng: 102.4167, river: 'Sungai Air Lemau', das: 'DAS Lemau' },
      { name: 'Kabupaten Bengkulu Utara', lat: -3.4167, lng: 102.1667, river: 'Sungai Air Lais', das: 'DAS Lais' },
      { name: 'Kabupaten Kaur', lat: -4.6833, lng: 103.3500, river: 'Sungai Air Luas', das: 'DAS Luas' },
      { name: 'Kabupaten Kepahiang', lat: -3.6500, lng: 102.5833, river: 'Sungai Musi Hulu', das: 'DAS Musi' },
      { name: 'Kabupaten Lebong', lat: -3.1500, lng: 102.2167, river: 'Sungai Ketahun', das: 'DAS Ketahun' },
      { name: 'Kabupaten Mukomuko', lat: -2.5833, lng: 101.1167, river: 'Sungai Air Manjunto', das: 'DAS Manjunto' },
      { name: 'Kabupaten Rejang Lebong', lat: -3.4667, lng: 102.5167, river: 'Sungai Beliti', das: 'DAS Musi' },
      { name: 'Kabupaten Seluma', lat: -4.0833, lng: 102.5833, river: 'Sungai Air Seluma', das: 'DAS Seluma' },
    ]
  },
  // 10. Lampung (15)
  {
    province: 'Lampung',
    items: [
      { name: 'Kota Bandar Lampung', lat: -5.4294, lng: 105.2625, river: 'Sungai Way Kuripan', das: 'DAS Way Kuripan' },
      { name: 'Kota Metro', lat: -5.1136, lng: 105.3067, river: 'Sungai Way Batanghari', das: 'DAS Sekampung' },
      { name: 'Kabupaten Lampung Barat', lat: -5.1333, lng: 104.1667, river: 'Sungai Way Semangka Hulu', das: 'DAS Semangka' },
      { name: 'Kabupaten Lampung Selatan', lat: -5.6833, lng: 105.5833, river: 'Sungai Way Pisang', das: 'DAS Sekampung' },
      { name: 'Kabupaten Lampung Tengah', lat: -4.9500, lng: 105.2167, river: 'Sungai Way Seputih', das: 'DAS Seputih' },
      { name: 'Kabupaten Lampung Timur', lat: -5.1000, lng: 105.6833, river: 'Sungai Way Sekampung Hilir', das: 'DAS Sekampung' },
      { name: 'Kabupaten Lampung Utara', lat: -4.8167, lng: 104.8833, river: 'Sungai Way Tulang Bawang', das: 'DAS Tulang Bawang' },
      { name: 'Kabupaten Mesuji', lat: -4.0167, lng: 105.4167, river: 'Sungai Way Mesuji', das: 'DAS Mesuji' },
      { name: 'Kabupaten Pesawaran', lat: -5.4500, lng: 105.1500, river: 'Sungai Way Ratai', das: 'DAS Ratai' },
      { name: 'Kabupaten Pesisir Barat', lat: -5.1833, lng: 103.9500, river: 'Sungai Way Krui', das: 'DAS Krui' },
      { name: 'Kabupaten Pringsewu', lat: -5.3500, lng: 104.9833, river: 'Sungai Way Bulok', das: 'DAS Sekampung' },
      { name: 'Kabupaten Tanggamus', lat: -5.4833, lng: 104.6667, river: 'Sungai Way Semaka', das: 'DAS Semaka' },
      { name: 'Kabupaten Tulang Bawang', lat: -4.4500, lng: 105.6833, river: 'Sungai Tulang Bawang', das: 'DAS Tulang Bawang' },
      { name: 'Kabupaten Tulang Bawang Barat', lat: -4.4333, lng: 105.0833, river: 'Sungai Way Kiri', das: 'DAS Tulang Bawang' },
      { name: 'Kabupaten Way Kanan', lat: -4.4833, lng: 104.5333, river: 'Sungai Way Besai', das: 'DAS Tulang Bawang' },
    ]
  },
  // 11. DKI Jakarta (6)
  {
    province: 'DKI Jakarta',
    items: [
      { name: 'Kota Jakarta Pusat', lat: -6.1702, lng: 106.8315, river: 'Sungai Ciliwung', das: 'DAS Ciliwung' },
      { name: 'Kota Jakarta Utara', lat: -6.1420, lng: 106.8730, river: 'Sungai Sunter', das: 'DAS Sunter' },
      { name: 'Kota Jakarta Barat', lat: -6.1683, lng: 106.7589, river: 'Sungai Pesanggrahan', das: 'DAS Pesanggrahan' },
      { name: 'Kota Jakarta Selatan', lat: -6.2615, lng: 106.8106, river: 'Sungai Krukut', das: 'DAS Ciliwung' },
      { name: 'Kota Jakarta Timur', lat: -6.2250, lng: 106.9004, river: 'Sungai Cipinang', das: 'DAS Cipinang' },
      { name: 'Kabupaten Kepulauan Seribu', lat: -5.6122, lng: 106.5622, river: 'Perairan Pulau Pramuka', das: 'DAS Pesisir Jakarta' },
    ]
  },
  // 12. Jawa Barat (27)
  {
    province: 'Jawa Barat',
    items: [
      { name: 'Kota Bandung', lat: -6.9175, lng: 107.6191, river: 'Sungai Cikapundung', das: 'DAS Citarum' },
      { name: 'Kota Bekasi', lat: -6.2383, lng: 106.9756, river: 'Sungai Kali Bekasi', das: 'DAS Citarum' },
      { name: 'Kota Bogor', lat: -6.5971, lng: 106.8060, river: 'Sungai Cisadane', das: 'DAS Cisadane' },
      { name: 'Kota Cimahi', lat: -6.8722, lng: 107.5422, river: 'Sungai Cimahi', das: 'DAS Citarum' },
      { name: 'Kota Cirebon', lat: -6.7063, lng: 108.5570, river: 'Sungai Sukalila', das: 'DAS Cisanggarung' },
      { name: 'Kota Depok', lat: -6.4025, lng: 106.7942, river: 'Sungai Ciliwung Depok', das: 'DAS Ciliwung' },
      { name: 'Kota Sukabumi', lat: -6.9278, lng: 106.9300, river: 'Sungai Cimandiri', das: 'DAS Cimandiri' },
      { name: 'Kota Tasikmalaya', lat: -7.3274, lng: 108.2207, river: 'Sungai Citanduy', das: 'DAS Citanduy' },
      { name: 'Kota Banjar', lat: -7.3686, lng: 108.5333, river: 'Sungai Citanduy Banjar', das: 'DAS Citanduy' },
      { name: 'Kabupaten Bandung', lat: -6.9850, lng: 107.6250, river: 'Sungai Citarum Dayeuhkolot', das: 'DAS Citarum' },
      { name: 'Kabupaten Bandung Barat', lat: -6.8500, lng: 107.5000, river: 'Sungai Citarum Padalarang', das: 'DAS Citarum' },
      { name: 'Kabupaten Bekasi', lat: -6.2500, lng: 107.1500, river: 'Sungai Citarum Hilir', das: 'DAS Citarum' },
      { name: 'Kabupaten Bogor', lat: -6.5000, lng: 106.8500, river: 'Sungai Cileungsi', das: 'DAS Ciliwung' },
      { name: 'Kabupaten Ciamis', lat: -7.3333, lng: 108.3500, river: 'Sungai Cileueur', das: 'DAS Citanduy' },
      { name: 'Kabupaten Cianjur', lat: -6.8167, lng: 107.1333, river: 'Sungai Cianjur', das: 'DAS Citarum' },
      { name: 'Kabupaten Cirebon', lat: -6.7500, lng: 108.5333, river: 'Sungai Cisanggarung', das: 'DAS Cisanggarung' },
      { name: 'Kabupaten Garut', lat: -7.2167, lng: 107.9000, river: 'Sungai Cimanuk', das: 'DAS Cimanuk' },
      { name: 'Kabupaten Indramayu', lat: -6.3333, lng: 108.3167, river: 'Sungai Cimanuk Hilir', das: 'DAS Cimanuk' },
      { name: 'Kabupaten Karawang', lat: -6.3000, lng: 107.3000, river: 'Sungai Citarum Karawang', das: 'DAS Citarum' },
      { name: 'Kabupaten Kuningan', lat: -6.9833, lng: 108.4833, river: 'Sungai Cisanggarung Hulu', das: 'DAS Cisanggarung' },
      { name: 'Kabupaten Majalengka', lat: -6.8333, lng: 108.2333, river: 'Sungai Cilutung', das: 'DAS Cimanuk' },
      { name: 'Kabupaten Pangandaran', lat: -7.7000, lng: 108.5000, river: 'Sungai Cikembulan', das: 'DAS Citanduy' },
      { name: 'Kabupaten Purwakarta', lat: -6.5500, lng: 107.4500, river: 'Waduk Jatiluhur', das: 'DAS Citarum' },
      { name: 'Kabupaten Subang', lat: -6.5667, lng: 107.7500, river: 'Sungai Ciasem', das: 'DAS Ciasem' },
      { name: 'Kabupaten Sukabumi', lat: -6.9833, lng: 106.7500, river: 'Sungai Cicatih', das: 'DAS Cimandiri' },
      { name: 'Kabupaten Sumedang', lat: -6.8500, lng: 107.9167, river: 'Waduk Jatigede', das: 'DAS Cimanuk' },
      { name: 'Kabupaten Tasikmalaya', lat: -7.3500, lng: 108.1167, river: 'Sungai Ciwulan', das: 'DAS Ciwulan' },
    ]
  },
  // 13. Banten (8)
  {
    province: 'Banten',
    items: [
      { name: 'Kota Cilegon', lat: -6.0022, lng: 106.0539, river: 'Sungai Medaksa', das: 'DAS Cidanau' },
      { name: 'Kota Serang', lat: -6.1103, lng: 106.1667, river: 'Sungai Cibanten', das: 'DAS Cibanten' },
      { name: 'Kota Tangerang', lat: -6.1783, lng: 106.6319, river: 'Sungai Cisadane Tangerang', das: 'DAS Cisadane' },
      { name: 'Kota Tangerang Selatan', lat: -6.2889, lng: 106.7178, river: 'Sungai Cisadane Tangsel', das: 'DAS Cisadane' },
      { name: 'Kabupaten Lebak', lat: -6.5833, lng: 106.2500, river: 'Sungai Ciujung Hulu', das: 'DAS Ciujung' },
      { name: 'Kabupaten Pandeglang', lat: -6.5333, lng: 105.9833, river: 'Sungai Cilemer', das: 'DAS Cilemer' },
      { name: 'Kabupaten Serang', lat: -6.1500, lng: 105.9833, river: 'Sungai Ciujung', das: 'DAS Ciujung' },
      { name: 'Kabupaten Tangerang', lat: -6.2000, lng: 106.4833, river: 'Sungai Cidurian', das: 'DAS Cidurian' },
    ]
  },
  // 14. Jawa Tengah (35)
  {
    province: 'Jawa Tengah',
    items: [
      { name: 'Kota Magelang', lat: -7.4706, lng: 110.2178, river: 'Sungai Progo Magelang', das: 'DAS Progo' },
      { name: 'Kota Pekalongan', lat: -6.8886, lng: 109.6753, river: 'Sungai Loji', das: 'DAS Kupang' },
      { name: 'Kota Salatiga', lat: -7.3306, lng: 110.5083, river: 'Sungai Kali Senjoyo', das: 'DAS Tuntang' },
      { name: 'Kota Semarang', lat: -6.9667, lng: 110.4167, river: 'Banjir Kanal Barat', das: 'DAS Garang' },
      { name: 'Kota Surakarta', lat: -7.5583, lng: 110.8584, river: 'Bengawan Solo Jurug', das: 'DAS Bengawan Solo' },
      { name: 'Kota Tegal', lat: -6.8694, lng: 109.1403, river: 'Sungai Kali Gung', das: 'DAS Gung' },
      { name: 'Kabupaten Banjarnegara', lat: -7.4000, lng: 109.7000, river: 'Sungai Serayu Banjarnegara', das: 'DAS Serayu' },
      { name: 'Kabupaten Banyumas', lat: -7.5167, lng: 109.2833, river: 'Sungai Serayu Banyumas', das: 'DAS Serayu' },
      { name: 'Kabupaten Batang', lat: -7.0000, lng: 109.8500, river: 'Sungai Kali Sambong', das: 'DAS Sambong' },
      { name: 'Kabupaten Blora', lat: -7.1000, lng: 111.4167, river: 'Bengawan Solo Cepu', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Boyolali', lat: -7.5333, lng: 110.6000, river: 'Sungai Kali Gandul', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Brebes', lat: -6.8667, lng: 109.0333, river: 'Sungai Pemali', das: 'DAS Pemali' },
      { name: 'Kabupaten Cilacap', lat: -7.7167, lng: 109.0000, river: 'Sungai Serayu Hilir', das: 'DAS Serayu' },
      { name: 'Kabupaten Demak', lat: -6.9000, lng: 110.6333, river: 'Sungai Tuntang Demak', das: 'DAS Tuntang' },
      { name: 'Kabupaten Grobogan', lat: -7.1000, lng: 110.9167, river: 'Sungai Lusi', das: 'DAS Jratunseluna' },
      { name: 'Kabupaten Jepara', lat: -6.5833, lng: 110.6667, river: 'Sungai Wiso', das: 'DAS Wiso' },
      { name: 'Kabupaten Karanganyar', lat: -7.6000, lng: 111.0000, river: 'Sungai Kali Samin', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Kebumen', lat: -7.6667, lng: 109.6500, river: 'Sungai Luk Ulo', das: 'DAS Luk Ulo' },
      { name: 'Kabupaten Kendal', lat: -7.0167, lng: 110.2000, river: 'Sungai Bodri', das: 'DAS Bodri' },
      { name: 'Kabupaten Klaten', lat: -7.7000, lng: 110.6000, river: 'Sungai Dengkeng', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Kudus', lat: -6.8000, lng: 110.8333, river: 'Sungai Gelis', das: 'DAS Gelis' },
      { name: 'Kabupaten Magelang', lat: -7.5833, lng: 110.2333, river: 'Sungai Elo', das: 'DAS Progo' },
      { name: 'Kabupaten Pati', lat: -6.7500, lng: 111.0333, river: 'Sungai Juwana', das: 'DAS Juwana' },
      { name: 'Kabupaten Pekalongan', lat: -7.0833, lng: 109.6333, river: 'Sungai Sengkarang', das: 'DAS Sengkarang' },
      { name: 'Kabupaten Pemalang', lat: -6.9000, lng: 109.3833, river: 'Sungai Comal', das: 'DAS Comal' },
      { name: 'Kabupaten Purbalingga', lat: -7.3833, lng: 109.3667, river: 'Sungai Klawing', das: 'DAS Serayu' },
      { name: 'Kabupaten Purworejo', lat: -7.7167, lng: 110.0167, river: 'Sungai Bogowonto', das: 'DAS Bogowonto' },
      { name: 'Kabupaten Rembang', lat: -6.7000, lng: 111.3500, river: 'Sungai Karanggeneng', das: 'DAS Rembang' },
      { name: 'Kabupaten Semarang', lat: -7.1833, lng: 110.4333, river: 'Danau Rawa Pening', das: 'DAS Tuntang' },
      { name: 'Kabupaten Sragen', lat: -7.4333, lng: 111.0167, river: 'Bengawan Solo Sragen', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Sukoharjo', lat: -7.6833, lng: 110.8333, river: 'Bengawan Solo Sukoharjo', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Tegal', lat: -7.0000, lng: 109.1500, river: 'Sungai Rambut', das: 'DAS Rambut' },
      { name: 'Kabupaten Temanggung', lat: -7.3167, lng: 110.1667, river: 'Sungai Progo Hulu', das: 'DAS Progo' },
      { name: 'Kabupaten Wonogiri', lat: -7.8167, lng: 110.9167, river: 'Waduk Gajah Mungkur', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Wonosobo', lat: -7.3667, lng: 109.9000, river: 'Sungai Serayu Hulu', das: 'DAS Serayu' },
    ]
  },
  // 15. DI Yogyakarta (5)
  {
    province: 'DI Yogyakarta',
    items: [
      { name: 'Kota Yogyakarta', lat: -7.7828, lng: 110.3670, river: 'Sungai Kali Code', das: 'DAS Opak-Oyo' },
      { name: 'Kabupaten Bantul', lat: -7.8250, lng: 110.3450, river: 'Sungai Kali Winongo', das: 'DAS Progo-Opak' },
      { name: 'Kabupaten Gunungkidul', lat: -7.9667, lng: 110.6000, river: 'Sungai Oyo', das: 'DAS Oyo' },
      { name: 'Kabupaten Kulon Progo', lat: -7.8167, lng: 110.1500, river: 'Sungai Progo Hilir', das: 'DAS Progo' },
      { 
        name: 'Kabupaten Sleman', 
        stationName: 'Stasiun KLHK 76',
        lat: -7.7161, 
        lng: 110.3556, 
        displayLat: '50.11466885199901°',
        displayLng: '-94.5226433910041°',
        district: 'Gamping',
        subdistrict: 'Tlogoadi',
        river: 'Sungai Brantas', 
        das: 'Brantas',
        status: 'baku_mutu',
        ipScore: 0.82
      },
    ]
  },
  // 16. Jawa Timur (38)
  {
    province: 'Jawa Timur',
    items: [
      { name: 'Kota Surabaya', lat: -7.2655, lng: 112.7521, river: 'Sungai Kali Mas', das: 'DAS Brantas' },
      { name: 'Kota Batu', lat: -7.8671, lng: 112.5239, river: 'Sumber Brantas', das: 'DAS Brantas' },
      { name: 'Kota Blitar', lat: -8.0983, lng: 112.1681, river: 'Sungai Kali Lahar', das: 'DAS Brantas' },
      { name: 'Kota Kediri', lat: -7.8167, lng: 112.0167, river: 'Sungai Brantas Kediri', das: 'DAS Brantas' },
      { name: 'Kota Madiun', lat: -7.6300, lng: 111.5300, river: 'Sungai Kali Madiun', das: 'DAS Bengawan Solo' },
      { name: 'Kota Malang', lat: -7.9839, lng: 112.6214, river: 'Sungai Brantas Malang', das: 'DAS Brantas' },
      { name: 'Kota Mojokerto', lat: -7.4667, lng: 112.4333, river: 'Sungai Kali Brantas Mojokerto', das: 'DAS Brantas' },
      { name: 'Kota Pasuruan', lat: -7.6450, lng: 112.9078, river: 'Sungai Gembong', das: 'DAS Gembong' },
      { name: 'Kota Probolinggo', lat: -7.7544, lng: 113.2158, river: 'Sungai Banger', das: 'DAS Banger' },
      { name: 'Kabupaten Bangkalan', lat: -7.0333, lng: 112.7500, river: 'Sungai Bancaran', das: 'DAS Bangkalan' },
      { name: 'Kabupaten Banyuwangi', lat: -8.2167, lng: 114.3667, river: 'Sungai Kali Bagong', das: 'DAS Banyuwangi' },
      { name: 'Kabupaten Blitar', lat: -8.1500, lng: 112.2167, river: 'Waduk Karangkates', das: 'DAS Brantas' },
      { name: 'Kabupaten Bojonegoro', lat: -7.1500, lng: 111.8833, river: 'Bengawan Solo Bojonegoro', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Bondowoso', lat: -7.9167, lng: 113.8167, river: 'Sungai Sampean', das: 'DAS Sampean' },
      { name: 'Kabupaten Gresik', lat: -7.1500, lng: 112.6500, river: 'Kali Lamong', das: 'DAS Solo-Brantas' },
      { name: 'Kabupaten Jember', lat: -8.1667, lng: 113.7000, river: 'Sungai Bedadung', das: 'DAS Bedadung' },
      { name: 'Kabupaten Jombang', lat: -7.5500, lng: 112.2333, river: 'Sungai Kali Brantas Jombang', das: 'DAS Brantas' },
      { name: 'Kabupaten Kediri', lat: -7.8667, lng: 112.1500, river: 'Sungai Kali Konto', das: 'DAS Brantas' },
      { name: 'Kabupaten Lamongan', lat: -7.1167, lng: 112.4167, river: 'Bengawan Solo Babat', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Lumajang', lat: -8.1333, lng: 113.2167, river: 'Sungai Kali Mujur', das: 'DAS Mujur' },
      { name: 'Kabupaten Madiun', lat: -7.5500, lng: 111.6500, river: 'Waduk Bening Widas', das: 'DAS Brantas' },
      { name: 'Kabupaten Magetan', lat: -7.6500, lng: 111.3333, river: 'Sungai Gandong', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Malang', lat: -8.1667, lng: 112.6500, river: 'Sungai Metro', das: 'DAS Brantas' },
      { name: 'Kabupaten Mojokerto', lat: -7.5500, lng: 112.5000, river: 'Sungai Kali Porong', das: 'DAS Brantas' },
      { name: 'Kabupaten Nganjuk', lat: -7.6000, lng: 111.9000, river: 'Sungai Kali Widas', das: 'DAS Brantas' },
      { name: 'Kabupaten Ngawi', lat: -7.4000, lng: 111.4500, river: 'Bengawan Solo Ngawi', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Pacitan', lat: -8.2000, lng: 111.1000, river: 'Sungai Grindulu', das: 'DAS Grindulu' },
      { name: 'Kabupaten Pamekasan', lat: -7.1667, lng: 113.4833, river: 'Sungai Semajid', das: 'DAS Pamekasan' },
      { name: 'Kabupaten Pasuruan', lat: -7.7000, lng: 112.8500, river: 'Sungai Rejoso', das: 'DAS Rejoso' },
      { name: 'Kabupaten Ponorogo', lat: -7.8667, lng: 111.4667, river: 'Sungai Kali Keyang', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Probolinggo', lat: -7.8333, lng: 113.3167, river: 'Sungai Pekalen', das: 'DAS Pekalen' },
      { name: 'Kabupaten Sampang', lat: -7.1833, lng: 113.2500, river: 'Sungai Kali Kemuning', das: 'DAS Kemuning' },
      { name: 'Kabupaten Sidoarjo', lat: -7.4500, lng: 112.7167, river: 'Sungai Kali Porong Sidoarjo', das: 'DAS Brantas' },
      { name: 'Kabupaten Situbondo', lat: -7.7000, lng: 114.0000, river: 'Sungai Sampean Hilir', das: 'DAS Sampean' },
      { name: 'Kabupaten Sumenep', lat: -7.0167, lng: 113.8667, river: 'Sungai Marengan', das: 'DAS Sumenep' },
      { name: 'Kabupaten Trenggalek', lat: -8.0500, lng: 111.7167, river: 'Sungai Ngasinan', das: 'DAS Ngasinan' },
      { name: 'Kabupaten Tuban', lat: -6.9000, lng: 112.0500, river: 'Bengawan Solo Tuban', das: 'DAS Bengawan Solo' },
      { name: 'Kabupaten Tulungagung', lat: -8.0667, lng: 111.9000, river: 'Sungai Kali Ngrowo', das: 'DAS Brantas' },
    ]
  },
  // 17. Bali (9)
  {
    province: 'Bali',
    items: [
      { name: 'Kota Denpasar', lat: -8.6475, lng: 115.2426, river: 'Sungai Ayung Kesiman', das: 'DAS Ayung' },
      { name: 'Kabupaten Badung', lat: -8.5833, lng: 115.1833, river: 'Sungai Tukad Mati', das: 'DAS Mati' },
      { name: 'Kabupaten Bangli', lat: -8.3000, lng: 115.3500, river: 'Danau Batur Inflow', das: 'DAS Batur' },
      { name: 'Kabupaten Buleleng', lat: -8.1167, lng: 115.0833, river: 'Sungai Tukad Buleleng', das: 'DAS Buleleng' },
      { name: 'Kabupaten Gianyar', lat: -8.5333, lng: 115.3333, river: 'Sungai Tukad Petanu', das: 'DAS Petanu' },
      { name: 'Kabupaten Jembrana', lat: -8.3667, lng: 114.6500, river: 'Sungai Tukad Ijo Gading', das: 'DAS Ijo Gading' },
      { name: 'Kabupaten Karangasem', lat: -8.4500, lng: 115.6000, river: 'Sungai Tukad Unda Hulu', das: 'DAS Unda' },
      { name: 'Kabupaten Klungkung', lat: -8.5333, lng: 115.4000, river: 'Sungai Tukad Unda Hilir', das: 'DAS Unda' },
      { name: 'Kabupaten Tabanan', lat: -8.5333, lng: 115.1167, river: 'Sungai Tukad Yeh Ho', das: 'DAS Yeh Ho' },
    ]
  },
  // 18. Nusa Tenggara Barat (10)
  {
    province: 'Nusa Tenggara Barat',
    items: [
      { name: 'Kota Mataram', lat: -8.5780, lng: 116.0820, river: 'Sungai Jangkok', das: 'DAS Meninting-Jangkok' },
      { name: 'Kota Bima', lat: -8.4667, lng: 118.7333, river: 'Sungai Padolo', das: 'DAS Padolo' },
      { name: 'Kabupaten Bima', lat: -8.5833, lng: 118.7167, river: 'Sungai Wadu Mbolo', das: 'DAS Bima' },
      { name: 'Kabupaten Dompu', lat: -8.5333, lng: 118.4500, river: 'Sungai Sori Silo', das: 'DAS Dompu' },
      { name: 'Kabupaten Lombok Barat', lat: -8.6833, lng: 116.1167, river: 'Sungai Dodokan', das: 'DAS Dodokan' },
      { name: 'Kabupaten Lombok Tengah', lat: -8.7000, lng: 116.2833, river: 'Sungai Babak', das: 'DAS Babak' },
      { name: 'Kabupaten Lombok Timur', lat: -8.6500, lng: 116.5333, river: 'Sungai Menanga', das: 'DAS Menanga' },
      { name: 'Kabupaten Lombok Utara', lat: -8.3500, lng: 116.2500, river: 'Sungai Sokong', das: 'DAS Sokong' },
      { name: 'Kabupaten Sumbawa', lat: -8.5000, lng: 117.4167, river: 'Sungai Brang Biji', das: 'DAS Sumbawa' },
      { name: 'Kabupaten Sumbawa Barat', lat: -8.7500, lng: 116.8500, river: 'Sungai Brang Rea', das: 'DAS Rea' },
    ]
  },
  // 19. Nusa Tenggara Timur (22)
  {
    province: 'Nusa Tenggara Timur',
    items: [
      { name: 'Kota Kupang', lat: -10.1772, lng: 123.6070, river: 'Kali Dendeng', das: 'DAS Dendeng' },
      { name: 'Kabupaten Alor', lat: -8.2833, lng: 124.7167, river: 'Sungai Sibolang', das: 'DAS Alor' },
      { name: 'Kabupaten Belu', lat: -9.5800, lng: 124.9000, river: 'Sungai Benanain Belu', das: 'DAS Benanain' },
      { name: 'Kabupaten Ende', lat: -8.8333, lng: 121.6500, river: 'Sungai Wolowona', das: 'DAS Wolowona' },
      { name: 'Kabupaten Flores Timur', lat: -8.3333, lng: 122.9833, river: 'Sungai Larantuka', das: 'DAS Flotim' },
      { name: 'Kabupaten Kupang', lat: -10.0500, lng: 123.8500, river: 'Sungai Noelmina', das: 'DAS Noelmina' },
      { name: 'Kabupaten Lembata', lat: -8.4500, lng: 123.5500, river: 'Sungai Lewoleba', das: 'DAS Lembata' },
      { name: 'Kabupaten Malaka', lat: -9.5667, lng: 124.8833, river: 'Sungai Benanain Hilir', das: 'DAS Benanain' },
      { name: 'Kabupaten Manggarai', lat: -8.6000, lng: 120.4667, river: 'Sungai Wae Pesi', das: 'DAS Wae Pesi' },
      { name: 'Kabupaten Manggarai Barat', lat: -8.5333, lng: 119.9833, river: 'Sungai Wae Mese', das: 'DAS Komodo' },
      { name: 'Kabupaten Manggarai Timur', lat: -8.6167, lng: 120.6000, river: 'Sungai Wae Bobo', das: 'DAS Bobo' },
      { name: 'Kabupaten Nagekeo', lat: -8.6833, lng: 121.3167, river: 'Sungai Aesesa', das: 'DAS Aesesa' },
      { name: 'Kabupaten Ngada', lat: -8.7667, lng: 120.9667, river: 'Sungai Wae Meo', das: 'DAS Meo' },
      { name: 'Kabupaten Rote Ndao', lat: -10.7333, lng: 123.1167, river: 'Danau Peto Inflow', das: 'DAS Rote' },
      { name: 'Kabupaten Sabu Raijua', lat: -10.5000, lng: 121.8333, river: 'Sungai Menia', das: 'DAS Sabu' },
      { name: 'Kabupaten Sikka', lat: -8.6167, lng: 122.2167, river: 'Sungai Nangagete', das: 'DAS Maumere' },
      { name: 'Kabupaten Sumba Barat', lat: -9.6500, lng: 119.3833, river: 'Sungai Wanokaka', das: 'DAS Wanokaka' },
      { name: 'Kabupaten Sumba Barat Daya', lat: -9.5667, lng: 119.0833, river: 'Sungai Polapare', das: 'DAS Polapare' },
      { name: 'Kabupaten Sumba Tengah', lat: -9.6167, lng: 119.6500, river: 'Sungai Pamalar', das: 'DAS Pamalar' },
      { name: 'Kabupaten Sumba Timur', lat: -9.8500, lng: 120.2500, river: 'Sungai Kambaniru', das: 'DAS Kambaniru' },
      { name: 'Kabupaten Timor Tengah Selatan', lat: -9.8667, lng: 124.2833, river: 'Sungai Noelmina Hulu', das: 'DAS Noelmina' },
      { name: 'Kabupaten Timor Tengah Utara', lat: -9.4500, lng: 124.5167, river: 'Sungai Mena', das: 'DAS Mena' },
    ]
  },
  // 20. Kalimantan Barat (14)
  {
    province: 'Kalimantan Barat',
    items: [
      { name: 'Kota Pontianak', lat: -0.0263, lng: 109.3425, river: 'Sungai Kapuas Pontianak', das: 'DAS Kapuas' },
      { name: 'Kota Singkawang', lat: 0.9000, lng: 108.9833, river: 'Sungai Singkawang', das: 'DAS Singkawang' },
      { name: 'Kabupaten Bengkayang', lat: 0.8167, lng: 109.6500, river: 'Sungai Sebalo', das: 'DAS Sambas' },
      { name: 'Kabupaten Kapuas Hulu', lat: 0.8800, lng: 112.9200, river: 'Sungai Kapuas Putussibau', das: 'DAS Kapuas' },
      { name: 'Kabupaten Kayong Utara', lat: -1.1833, lng: 109.9667, river: 'Sungai Sukadana', das: 'DAS Kayong' },
      { name: 'Kabupaten Ketapang', lat: -1.8333, lng: 109.9667, river: 'Sungai Pawan', das: 'DAS Pawan' },
      { name: 'Kabupaten Kubu Raya', lat: -0.3833, lng: 109.3833, river: 'Sungai Kapuas Kecil', das: 'DAS Kapuas' },
      { name: 'Kabupaten Landak', lat: 0.4167, lng: 109.7500, river: 'Sungai Landak', das: 'DAS Kapuas' },
      { name: 'Kabupaten Melawi', lat: -0.3333, lng: 111.7000, river: 'Sungai Melawi', das: 'DAS Kapuas' },
      { name: 'Kabupaten Mempawah', lat: 0.3667, lng: 109.1833, river: 'Sungai Mempawah', das: 'DAS Mempawah' },
      { name: 'Kabupaten Sambas', lat: 1.3667, lng: 109.3000, river: 'Sungai Sambas Besar', das: 'DAS Sambas' },
      { name: 'Kabupaten Sanggau', lat: 0.1167, lng: 110.5833, river: 'Sungai Sekayam', das: 'DAS Kapuas' },
      { name: 'Kabupaten Sekadau', lat: 0.0333, lng: 110.9500, river: 'Sungai Sekadau', das: 'DAS Kapuas' },
      { name: 'Kabupaten Sintang', lat: 0.0667, lng: 111.5000, river: 'Sungai Kapuas Sintang', das: 'DAS Kapuas' },
    ]
  },
  // 21. Kalimantan Tengah (14)
  {
    province: 'Kalimantan Tengah',
    items: [
      { name: 'Kota Palangka Raya', lat: -2.2088, lng: 113.9142, river: 'Sungai Kahayan', das: 'DAS Kahayan' },
      { name: 'Kabupaten Barito Selatan', lat: -1.7500, lng: 114.8333, river: 'Sungai Barito Buntok', das: 'DAS Barito' },
      { name: 'Kabupaten Barito Timur', lat: -2.0000, lng: 115.1167, river: 'Sungai Paku', das: 'DAS Barito' },
      { name: 'Kabupaten Barito Utara', lat: -0.9500, lng: 115.0000, river: 'Sungai Barito Muara Teweh', das: 'DAS Barito' },
      { name: 'Kabupaten Gunung Mas', lat: -1.0500, lng: 113.8500, river: 'Sungai Kahayan Hulu', das: 'DAS Kahayan' },
      { name: 'Kabupaten Kapuas', lat: -3.0000, lng: 114.3833, river: 'Sungai Kapuas Murung', das: 'DAS Kapuas Murung' },
      { name: 'Kabupaten Katingan', lat: -2.0667, lng: 113.4000, river: 'Sungai Katingan', das: 'DAS Katingan' },
      { name: 'Kabupaten Kotawaringin Barat', lat: -2.6833, lng: 111.6167, river: 'Sungai Arut', das: 'DAS Lamandau' },
      { name: 'Kabupaten Kotawaringin Timur', lat: -2.5333, lng: 112.9500, river: 'Sungai Mentaya Sampit', das: 'DAS Mentaya' },
      { name: 'Kabupaten Lamandau', lat: -2.0333, lng: 111.4500, river: 'Sungai Lamandau', das: 'DAS Lamandau' },
      { name: 'Kabupaten Murung Raya', lat: -0.3500, lng: 114.5000, river: 'Sungai Barito Puruk Cahu', das: 'DAS Barito' },
      { name: 'Kabupaten Pulang Pisau', lat: -2.7500, lng: 114.2500, river: 'Sungai Kahayan Hilir', das: 'DAS Kahayan' },
      { name: 'Kabupaten Sukamara', lat: -2.6333, lng: 111.2333, river: 'Sungai Jelai', das: 'DAS Jelai' },
      { name: 'Kabupaten Seruyan', lat: -2.5000, lng: 112.5500, river: 'Sungai Seruyan', das: 'DAS Seruyan' },
    ]
  },
  // 22. Kalimantan Selatan (13)
  {
    province: 'Kalimantan Selatan',
    items: [
      { name: 'Kota Banjarmasin', lat: -3.3245, lng: 114.5658, river: 'Sungai Barito Trisakti', das: 'DAS Barito' },
      { name: 'Kota Banjarbaru', lat: -3.4406, lng: 114.8308, river: 'Sungai Kemuning Banjarbaru', das: 'DAS Barito' },
      { name: 'Kabupaten Balangan', lat: -2.3333, lng: 115.5000, river: 'Sungai Balangan', das: 'DAS Barito' },
      { name: 'Kabupaten Banjar', lat: -3.4167, lng: 115.0833, river: 'Sungai Riam Kanan', das: 'DAS Barito' },
      { name: 'Kabupaten Barito Kuala', lat: -3.1000, lng: 114.6000, river: 'Sungai Barito Marabahan', das: 'DAS Barito' },
      { name: 'Kabupaten Hulu Sungai Selatan', lat: -2.7500, lng: 115.2500, river: 'Sungai Amandit', das: 'DAS Barito' },
      { name: 'Kabupaten Hulu Sungai Tengah', lat: -2.6000, lng: 115.4167, river: 'Sungai Barabai', das: 'DAS Barito' },
      { name: 'Kabupaten Hulu Sungai Utara', lat: -2.4333, lng: 115.2500, river: 'Sungai Negara', das: 'DAS Barito' },
      { name: 'Kabupaten Kotabaru', lat: -3.2000, lng: 116.2167, river: 'Selat Laut', das: 'DAS Kotabaru' },
      { name: 'Kabupaten Tabalong', lat: -1.9000, lng: 115.5000, river: 'Sungai Tabalong', das: 'DAS Barito' },
      { name: 'Kabupaten Tanah Bumbu', lat: -3.5333, lng: 115.7500, river: 'Sungai Batulicin', das: 'DAS Batulicin' },
      { name: 'Kabupaten Tanah Laut', lat: -3.8833, lng: 114.8333, river: 'Sungai Tabanio', das: 'DAS Tabanio' },
      { name: 'Kabupaten Tapin', lat: -2.9167, lng: 115.1667, river: 'Sungai Tapin', das: 'DAS Barito' },
    ]
  },
  // 23. Kalimantan Timur (10)
  {
    province: 'Kalimantan Timur',
    items: [
      { name: 'Kota Samarinda', lat: -0.5050, lng: 117.1400, river: 'Sungai Mahakam Mahkota', das: 'DAS Mahakam' },
      { name: 'Kota Balikpapan', lat: -1.2654, lng: 116.8312, river: 'Sungai Manggar', das: 'DAS Manggar' },
      { name: 'Kota Bontang', lat: 0.1333, lng: 117.5000, river: 'Sungai Bontang', das: 'DAS Bontang' },
      { name: 'Kabupaten Berau', lat: 2.1667, lng: 117.5000, river: 'Sungai Kelay', das: 'DAS Berau' },
      { name: 'Kabupaten Kutai Barat', lat: -0.5833, lng: 115.7500, river: 'Sungai Mahakam Hulu', das: 'DAS Mahakam' },
      { name: 'Kabupaten Kutai Kartanegara', lat: -0.4333, lng: 117.0000, river: 'Sungai Mahakam Tenggarong', das: 'DAS Mahakam' },
      { name: 'Kabupaten Kutai Timur', lat: 0.5500, lng: 117.5833, river: 'Sungai Sangatta', das: 'DAS Sangatta' },
      { name: 'Kabupaten Mahakam Ulu', lat: 0.4000, lng: 114.9500, river: 'Sungai Mahakam Ujoh Bilang', das: 'DAS Mahakam' },
      { name: 'Kabupaten Paser', lat: -1.9000, lng: 116.2000, river: 'Sungai Kandilo', das: 'DAS Kandilo' },
      { name: 'Kabupaten Penajam Paser Utara', lat: -1.2500, lng: 116.6500, river: 'Sungai Riko IKN', das: 'DAS Sepaku' },
    ]
  },
  // 24. Kalimantan Utara (5)
  {
    province: 'Kalimantan Utara',
    items: [
      { name: 'Kota Tarakan', lat: 3.3278, lng: 117.5961, river: 'Sungai Sesayap Hilir', das: 'DAS Sesayap' },
      { name: 'Kabupaten Bulungan', lat: 2.9000, lng: 117.3500, river: 'Sungai Kayan Tanjung Selor', das: 'DAS Kayan' },
      { name: 'Kabupaten Malinau', lat: 3.5833, lng: 116.6333, river: 'Sungai Sesayap Malinau', das: 'DAS Sesayap' },
      { name: 'Kabupaten Nunukan', lat: 4.1333, lng: 117.6667, river: 'Sungai Sebuku', das: 'DAS Sebuku' },
      { name: 'Kabupaten Tana Tidung', lat: 3.5500, lng: 117.2500, river: 'Sungai Sesayap Tideng Pale', das: 'DAS Sesayap' },
    ]
  },
  // 25. Sulawesi Utara (15)
  {
    province: 'Sulawesi Utara',
    items: [
      { name: 'Kota Manado', lat: 1.4880, lng: 124.8421, river: 'Sungai Tondano Manado', das: 'DAS Tondano' },
      { name: 'Kota Bitung', lat: 1.4406, lng: 125.1889, river: 'Sungai Girian', das: 'DAS Girian' },
      { name: 'Kota Kotamobagu', lat: 0.7306, lng: 124.3139, river: 'Sungai Ongkag Mongondow', das: 'DAS Dumoga' },
      { name: 'Kota Tomohon', lat: 1.3283, lng: 124.8406, river: 'Danau Linow Inflow', das: 'DAS Ranoyapo' },
      { name: 'Kabupaten Bolaang Mongondow', lat: 0.8500, lng: 124.1667, river: 'Sungai Dumoga', das: 'DAS Dumoga' },
      { name: 'Kabupaten Bolaang Mongondow Selatan', lat: 0.4167, lng: 123.8500, river: 'Sungai Milangodaa', das: 'DAS Bolsel' },
      { name: 'Kabupaten Bolaang Mongondow Timur', lat: 0.7500, lng: 124.5500, river: 'Sungai Buyat', das: 'DAS Buyat' },
      { name: 'Kabupaten Bolaang Mongondow Utara', lat: 0.8833, lng: 123.5833, river: 'Sungai Bintauna', das: 'DAS Bintauna' },
      { name: 'Kabupaten Kepulauan Sangihe', lat: 3.6500, lng: 125.5000, river: 'Sungai Tahuna', das: 'DAS Sangihe' },
      { name: 'Kabupaten Kepulauan Siau Tagulandang Biaro', lat: 2.7500, lng: 125.3833, river: 'Sungai Ondong Siau', das: 'DAS Sitaro' },
      { name: 'Kabupaten Kepulauan Talaud', lat: 4.3333, lng: 126.7500, river: 'Sungai Melonguane', das: 'DAS Talaud' },
      { name: 'Kabupaten Minahasa', lat: 1.2500, lng: 124.9167, river: 'Danau Tondano', das: 'DAS Tondano' },
      { name: 'Kabupaten Minahasa Selatan', lat: 1.1500, lng: 124.5833, river: 'Sungai Ranoyapo', das: 'DAS Ranoyapo' },
      { name: 'Kabupaten Minahasa Tenggara', lat: 1.0500, lng: 124.7833, river: 'Sungai Ratahan', das: 'DAS Mitra' },
      { name: 'Kabupaten Minahasa Utara', lat: 1.4167, lng: 124.9667, river: 'Sungai Likupang', das: 'DAS Likupang' },
    ]
  },
  // 26. Gorontalo (6)
  {
    province: 'Gorontalo',
    items: [
      { name: 'Kota Gorontalo', lat: 0.5436, lng: 123.0567, river: 'Sungai Bone Gorontalo', das: 'DAS Bone' },
      { name: 'Kabupaten Boalemo', lat: 0.6500, lng: 122.3333, river: 'Sungai Paguyaman', das: 'DAS Paguyaman' },
      { name: 'Kabupaten Bone Bolango', lat: 0.5500, lng: 123.2000, river: 'Sungai Bulango', das: 'DAS Bone' },
      { name: 'Kabupaten Gorontalo', lat: 0.6167, lng: 122.9500, river: 'Danau Limboto Inflow', das: 'DAS Limboto' },
      { name: 'Kabupaten Gorontalo Utara', lat: 0.8500, lng: 122.7500, river: 'Sungai Kwandang', das: 'DAS Kwandang' },
      { name: 'Kabupaten Pohuwato', lat: 0.5000, lng: 121.7500, river: 'Sungai Marisa', das: 'DAS Marisa' },
    ]
  },
  // 27. Sulawesi Tengah (13)
  {
    province: 'Sulawesi Tengah',
    items: [
      { name: 'Kota Palu', lat: -0.9000, lng: 119.8708, river: 'Sungai Palu', das: 'DAS Palu' },
      { name: 'Kabupaten Banggai', lat: -1.0500, lng: 122.7833, river: 'Sungai Luwuk', das: 'DAS Luwuk' },
      { name: 'Kabupaten Banggai Kepulauan', lat: -1.3333, lng: 123.5000, river: 'Sungai Salakan', das: 'DAS Banggai' },
      { name: 'Kabupaten Banggai Laut', lat: -1.6167, lng: 123.5500, river: 'Sungai Banggai', das: 'DAS Banggai Laut' },
      { name: 'Kabupaten Buol', lat: 1.0500, lng: 121.3667, river: 'Sungai Buol', das: 'DAS Buol' },
      { name: 'Kabupaten Donggala', lat: -0.6833, lng: 119.7500, river: 'Sungai Lariang Donggala', das: 'DAS Lariang' },
      { name: 'Kabupaten Morowali', lat: -2.3333, lng: 121.9000, river: 'Sungai Bahodopi', das: 'DAS Bahodopi' },
      { name: 'Kabupaten Morowali Utara', lat: -1.9500, lng: 121.3333, river: 'Sungai Laa', das: 'DAS Laa' },
      { name: 'Kabupaten Parigi Moutong', lat: -0.8333, lng: 120.1833, river: 'Sungai Parigi', das: 'DAS Parigi' },
      { name: 'Kabupaten Poso', lat: -1.4000, lng: 120.7500, river: 'Sungai Poso', das: 'DAS Poso' },
      { name: 'Kabupaten Sigi', lat: -1.1833, lng: 119.9500, river: 'Sungai Gumbasa', das: 'DAS Palu' },
      { name: 'Kabupaten Tojo Una-Una', lat: -1.1500, lng: 121.5000, river: 'Sungai Ampana', das: 'DAS Ampana' },
      { name: 'Kabupaten Tolitoli', lat: 1.0500, lng: 120.8000, river: 'Sungai Lemba', das: 'DAS Tolitoli' },
    ]
  },
  // 28. Sulawesi Barat (6)
  {
    province: 'Sulawesi Barat',
    items: [
      { name: 'Kabupaten Majene', lat: -3.0000, lng: 118.8833, river: 'Sungai Tubo', das: 'DAS Majene' },
      { name: 'Kabupaten Mamasa', lat: -2.9333, lng: 119.3833, river: 'Sungai Mamasa', das: 'DAS Saddang' },
      { name: 'Kabupaten Mamuju', lat: -2.6667, lng: 118.8833, river: 'Sungai Karema', das: 'DAS Mamuju' },
      { name: 'Kabupaten Mamuju Tengah', lat: -2.1500, lng: 119.2500, river: 'Sungai Budong-Budong', das: 'DAS Budong-Budong' },
      { name: 'Kabupaten Pasangkayu', lat: -1.4500, lng: 119.3667, river: 'Sungai Lariang Hilir', das: 'DAS Lariang' },
      { name: 'Kabupaten Polewali Mandar', lat: -3.4167, lng: 119.3333, river: 'Sungai Maloso', das: 'DAS Maloso' },
    ]
  },
  // 29. Sulawesi Selatan (24)
  {
    province: 'Sulawesi Selatan',
    items: [
      { name: 'Kota Makassar', lat: -5.1477, lng: 119.4328, river: 'Sungai Jeneberang Makassar', das: 'DAS Jeneberang' },
      { name: 'Kota Palopo', lat: -2.9944, lng: 120.1969, river: 'Sungai Latuppa', das: 'DAS Latuppa' },
      { name: 'Kota Parepare', lat: -4.0139, lng: 119.6253, river: 'Sungai Karajae', das: 'DAS Karajae' },
      { name: 'Kabupaten Bantaeng', lat: -5.5500, lng: 119.9500, river: 'Sungai Calendu', das: 'DAS Calendu' },
      { name: 'Kabupaten Barru', lat: -4.4167, lng: 119.6500, river: 'Sungai Lampoko', das: 'DAS Lampoko' },
      { name: 'Kabupaten Bone', lat: -4.6833, lng: 120.1667, river: 'Sungai Walanae Bone', das: 'DAS Walanae' },
      { name: 'Kabupaten Bulukumba', lat: -5.5500, lng: 120.2000, river: 'Sungai Bialo', das: 'DAS Bialo' },
      { name: 'Kabupaten Enrekang', lat: -3.5667, lng: 119.7833, river: 'Sungai Saddang Enrekang', das: 'DAS Saddang' },
      { name: 'Kabupaten Gowa', lat: -5.3000, lng: 119.7500, river: 'Waduk Bili-Bili', das: 'DAS Jeneberang' },
      { name: 'Kabupaten Jeneponto', lat: -5.6667, lng: 119.6833, river: 'Sungai Kelara', das: 'DAS Kelara' },
      { name: 'Kabupaten Kepulauan Selayar', lat: -6.1167, lng: 120.5000, river: 'Sungai Benteng', das: 'DAS Selayar' },
      { name: 'Kabupaten Luwu', lat: -3.3500, lng: 120.2500, river: 'Sungai Suso', das: 'DAS Suso' },
      { name: 'Kabupaten Luwu Timur', lat: -2.5833, lng: 121.1500, river: 'Danau Matano Inflow', das: 'DAS Malili' },
      { name: 'Kabupaten Luwu Utara', lat: -2.6000, lng: 120.3333, river: 'Sungai Rongkong', das: 'DAS Rongkong' },
      { name: 'Kabupaten Maros', lat: -5.0000, lng: 119.6333, river: 'Sungai Maros', das: 'DAS Maros' },
      { name: 'Kabupaten Pangkajene dan Kepulauan', lat: -4.8333, lng: 119.5500, river: 'Sungai Pangkajene', das: 'DAS Pangkajene' },
      { name: 'Kabupaten Pinrang', lat: -3.7833, lng: 119.6500, river: 'Sungai Saddang Hilir', das: 'DAS Saddang' },
      { name: 'Kabupaten Sidenreng Rappang', lat: -3.9333, lng: 119.8667, river: 'Danau Sidenreng', das: 'DAS Walanae' },
      { name: 'Kabupaten Sinjai', lat: -5.2167, lng: 120.1500, river: 'Sungai Tangka', das: 'DAS Tangka' },
      { name: 'Kabupaten Soppeng', lat: -4.3500, lng: 119.8833, river: 'Sungai Walanae Watansoppeng', das: 'DAS Walanae' },
      { name: 'Kabupaten Takalar', lat: -5.4167, lng: 119.5833, river: 'Sungai Pamukkulu', das: 'DAS Jeneberang' },
      { name: 'Kabupaten Tana Toraja', lat: -3.1500, lng: 119.8500, river: 'Sungai Saddang Makale', das: 'DAS Saddang' },
      { name: 'Kabupaten Toraja Utara', lat: -2.9667, lng: 119.9000, river: 'Sungai Mai\'ting', das: 'DAS Saddang' },
      { name: 'Kabupaten Wajo', lat: -4.1333, lng: 120.0333, river: 'Danau Tempe Inflow', das: 'DAS Walanae' },
    ]
  },
  // 30. Sulawesi Tenggara (17)
  {
    province: 'Sulawesi Tenggara',
    items: [
      { name: 'Kota Kendari', lat: -3.9667, lng: 122.5833, river: 'Sungai Wanggu', das: 'DAS Wanggu' },
      { name: 'Kota Baubau', lat: -5.4667, lng: 122.6167, river: 'Sungai Baubau', das: 'DAS Baubau' },
      { name: 'Kabupaten Bombana', lat: -4.7500, lng: 121.8333, river: 'Sungai Poleang', das: 'DAS Poleang' },
      { name: 'Kabupaten Buton', lat: -5.1667, lng: 122.9000, river: 'Sungai Pasarwajo', das: 'DAS Buton' },
      { name: 'Kabupaten Buton Selatan', lat: -5.6000, lng: 122.7500, river: 'Sungai Sampolawa', das: 'DAS Busel' },
      { name: 'Kabupaten Buton Tengah', lat: -5.3000, lng: 122.4500, river: 'Sungai Mawasangka', das: 'DAS Buteng' },
      { name: 'Kabupaten Buton Utara', lat: -4.8500, lng: 123.0000, river: 'Sungai Kulisusu', das: 'DAS Butur' },
      { name: 'Kabupaten Kolaka', lat: -4.0500, lng: 121.6000, river: 'Sungai Kolaka', das: 'DAS Kolaka' },
      { name: 'Kabupaten Kolaka Timur', lat: -4.1000, lng: 121.8500, river: 'Sungai Simbune', das: 'DAS Koltim' },
      { name: 'Kabupaten Kolaka Utara', lat: -3.2500, lng: 121.0500, river: 'Sungai Rante Angin', das: 'DAS Kolut' },
      { name: 'Kabupaten Konawe', lat: -3.9167, lng: 122.0500, river: 'Sungai Konaweha', das: 'DAS Konaweha' },
      { name: 'Kabupaten Konawe Kepulauan', lat: -4.1167, lng: 123.0500, river: 'Sungai Wawonii', das: 'DAS Wawonii' },
      { name: 'Kabupaten Konawe Selatan', lat: -4.3333, lng: 122.3500, river: 'Sungai Roraya', das: 'DAS Roraya' },
      { name: 'Kabupaten Konawe Utara', lat: -3.4000, lng: 122.1000, river: 'Sungai Lasolo', das: 'DAS Lasolo' },
      { name: 'Kabupaten Muna', lat: -4.8500, lng: 122.7000, river: 'Sungai Raha', das: 'DAS Muna' },
      { name: 'Kabupaten Muna Barat', lat: -4.8000, lng: 122.4833, river: 'Sungai Laworo', das: 'DAS Laworo' },
      { name: 'Kabupaten Wakatobi', lat: -5.3167, lng: 123.5833, river: 'Perairan Wangi-Wangi', das: 'DAS Wakatobi' },
    ]
  },
  // 31. Maluku (11)
  {
    province: 'Maluku',
    items: [
      { name: 'Kota Ambon', lat: -3.6600, lng: 128.2100, river: 'Sungai Wai Ruhu', das: 'DAS Ruhu' },
      { name: 'Kota Tual', lat: -5.6333, lng: 132.7500, river: 'Sungai Dullah', das: 'DAS Tual' },
      { name: 'Kabupaten Buru', lat: -3.3333, lng: 127.1000, river: 'Sungai Wai Apu', das: 'DAS Wai Apu' },
      { name: 'Kabupaten Buru Selatan', lat: -3.7667, lng: 126.8500, river: 'Sungai Wai Nibe', das: 'DAS Buru Selatan' },
      { name: 'Kabupaten Kepulauan Aru', lat: -5.7500, lng: 134.5000, river: 'Sungai Dobo', das: 'DAS Aru' },
      { name: 'Kabupaten Kepulauan Tanimbar', lat: -7.8333, lng: 131.3333, river: 'Sungai Saumlaki', das: 'DAS Tanimbar' },
      { name: 'Kabupaten Maluku Barat Daya', lat: -7.9833, lng: 127.9500, river: 'Sungai Tiakur', das: 'DAS MBD' },
      { name: 'Kabupaten Maluku Tengah', lat: -3.3167, lng: 128.9500, river: 'Sungai Wai Mala', das: 'DAS Malteng' },
      { name: 'Kabupaten Maluku Tenggara', lat: -5.7500, lng: 132.7333, river: 'Sungai Langgur', das: 'DAS Kei' },
      { name: 'Kabupaten Seram Bagian Barat', lat: -3.1500, lng: 128.3333, river: 'Sungai Tala', das: 'DAS Tala' },
      { name: 'Kabupaten Seram Bagian Timur', lat: -3.1000, lng: 130.5000, river: 'Sungai Bula', das: 'DAS SBT' },
    ]
  },
  // 32. Maluku Utara (10)
  {
    province: 'Maluku Utara',
    items: [
      { name: 'Kota Ternate', lat: 0.8000, lng: 127.3800, river: 'Sungai Ake Gaale Ternate', das: 'DAS Gaale' },
      { name: 'Kota Tidore Kepulauan', lat: 0.6833, lng: 127.4333, river: 'Sungai Ake Laba', das: 'DAS Tidore' },
      { name: 'Kabupaten Halmahera Barat', lat: 1.1000, lng: 127.5000, river: 'Sungai Jailolo', das: 'DAS Jailolo' },
      { name: 'Kabupaten Halmahera Tengah', lat: 0.4667, lng: 128.2500, river: 'Sungai Weda', das: 'DAS Weda' },
      { name: 'Kabupaten Halmahera Timur', lat: 1.3333, lng: 128.3833, river: 'Sungai Maba', das: 'DAS Maba' },
      { name: 'Kabupaten Halmahera Selatan', lat: -0.6667, lng: 127.8333, river: 'Sungai Labuha', das: 'DAS Bacan' },
      { name: 'Kabupaten Halmahera Utara', lat: 1.5500, lng: 128.0000, river: 'Sungai Tobelo', das: 'DAS Tobelo' },
      { name: 'Kabupaten Kepulauan Sula', lat: -1.9833, lng: 125.9833, river: 'Sungai Sanana', das: 'DAS Sula' },
      { name: 'Kabupaten Pulau Morotai', lat: 2.3333, lng: 128.4167, river: 'Sungai Daruba', das: 'DAS Morotai' },
      { name: 'Kabupaten Pulau Taliabu', lat: -1.8000, lng: 124.8000, river: 'Sungai Bobong', das: 'DAS Taliabu' },
    ]
  },
  // 33. Papua (9)
  {
    province: 'Papua',
    items: [
      { name: 'Kota Jayapura', lat: -2.5337, lng: 140.7181, river: 'Sungai Anafre Jayapura', das: 'DAS Anafre' },
      { name: 'Kabupaten Jayapura', lat: -2.6167, lng: 140.4000, river: 'Danau Sentani Inflow', das: 'DAS Sentani' },
      { name: 'Kabupaten Biak Numfor', lat: -0.9833, lng: 136.0000, river: 'Sungai Biak', das: 'DAS Biak' },
      { name: 'Kabupaten Keerom', lat: -3.2833, lng: 140.7500, river: 'Sungai Tami', das: 'DAS Tami' },
      { name: 'Kabupaten Kepulauan Yapen', lat: -1.7500, lng: 136.2500, river: 'Sungai Serui', das: 'DAS Yapen' },
      { name: 'Kabupaten Mamberamo Raya', lat: -2.0000, lng: 137.9000, river: 'Sungai Mamberamo', das: 'DAS Mamberamo' },
      { name: 'Kabupaten Sarmi', lat: -1.8667, lng: 138.7500, river: 'Sungai Tor', das: 'DAS Tor' },
      { name: 'Kabupaten Supiori', lat: -0.7500, lng: 135.6000, river: 'Sungai Sorendiweri', das: 'DAS Supiori' },
      { name: 'Kabupaten Waropen', lat: -2.4833, lng: 136.8500, river: 'Sungai Botawa', das: 'DAS Waropen' },
    ]
  },
  // 34. Papua Barat (7)
  {
    province: 'Papua Barat',
    items: [
      { name: 'Kabupaten Manokwari', lat: -0.8617, lng: 134.0620, river: 'Sungai Maruni Manokwari', das: 'DAS Maruni' },
      { name: 'Kabupaten Fakfak', lat: -2.9333, lng: 132.3000, river: 'Sungai Fakfak', das: 'DAS Fakfak' },
      { name: 'Kabupaten Kaimana', lat: -3.6500, lng: 133.7667, river: 'Sungai Kaimana', das: 'DAS Kaimana' },
      { name: 'Kabupaten Manokwari Selatan', lat: -1.3333, lng: 134.1667, river: 'Sungai Ransiki', das: 'DAS Ransiki' },
      { name: 'Kabupaten Pegunungan Arfak', lat: -1.2500, lng: 133.9167, river: 'Danau Anggi Giji', das: 'DAS Arfak' },
      { name: 'Kabupaten Teluk Bintuni', lat: -2.1333, lng: 133.5167, river: 'Sungai Muturi', das: 'DAS Bintuni' },
      { name: 'Kabupaten Teluk Wondama', lat: -2.7000, lng: 134.5000, river: 'Sungai Rasiei', das: 'DAS Wondama' },
    ]
  },
  // 35. Papua Selatan (4)
  {
    province: 'Papua Selatan',
    items: [
      { name: 'Kabupaten Merauke', lat: -8.4991, lng: 140.4011, river: 'Sungai Maro Merauke', das: 'DAS Maro' },
      { name: 'Kabupaten Asmat', lat: -5.4000, lng: 138.4500, river: 'Sungai Lorentz', das: 'DAS Lorentz' },
      { name: 'Kabupaten Boven Digoel', lat: -5.7500, lng: 140.3333, river: 'Sungai Digoel Tanah Merah', das: 'DAS Digoel' },
      { name: 'Kabupaten Mappi', lat: -6.5000, lng: 139.3333, river: 'Sungai Mappi Kepi', das: 'DAS Mappi' },
    ]
  },
  // 36. Papua Tengah (8)
  {
    province: 'Papua Tengah',
    items: [
      { name: 'Kabupaten Nabire', lat: -3.3667, lng: 135.4833, river: 'Sungai Nabire', das: 'DAS Nabire' },
      { name: 'Kabupaten Deiyai', lat: -4.0167, lng: 136.0000, river: 'Danau Tigi Inflow', das: 'DAS Tigi' },
      { name: 'Kabupaten Dogiyai', lat: -4.0500, lng: 135.8500, river: 'Sungai Dogiyai', das: 'DAS Dogiyai' },
      { name: 'Kabupaten Intan Jaya', lat: -3.7500, lng: 136.7500, river: 'Sungai Sugapa', das: 'DAS Sugapa' },
      { name: 'Kabupaten Mimika', lat: -4.5500, lng: 136.8833, river: 'Sungai Kamora Timika', das: 'DAS Kamora' },
      { name: 'Kabupaten Paniai', lat: -3.9000, lng: 136.3167, river: 'Danau Paniai Inflow', das: 'DAS Paniai' },
      { name: 'Kabupaten Puncak', lat: -3.8500, lng: 137.1500, river: 'Sungai Ilaga', das: 'DAS Ilaga' },
      { name: 'Kabupaten Puncak Jaya', lat: -3.6500, lng: 137.6000, river: 'Sungai Mulia', das: 'DAS Mulia' },
    ]
  },
  // 37. Papua Pegunungan (8)
  {
    province: 'Papua Pegunungan',
    items: [
      { name: 'Kabupaten Jayawijaya', lat: -4.0833, lng: 138.9500, river: 'Sungai Baliem Wamena', das: 'DAS Baliem' },
      { name: 'Kabupaten Lanny Jaya', lat: -3.9500, lng: 138.4500, river: 'Sungai Tiom', das: 'DAS Baliem' },
      { name: 'Kabupaten Mamberamo Tengah', lat: -3.5500, lng: 138.8333, river: 'Sungai Kobakma', das: 'DAS Mamberamo' },
      { name: 'Kabupaten Nduga', lat: -4.4167, lng: 138.3333, river: 'Sungai Kenyam', das: 'DAS Lorentz' },
      { name: 'Kabupaten Pegunungan Bintang', lat: -4.8333, lng: 140.6667, river: 'Sungai Oksibil', das: 'DAS Digul' },
      { name: 'Kabupaten Tolikara', lat: -3.6000, lng: 138.5833, river: 'Sungai Karubaga', das: 'DAS Baliem' },
      { name: 'Kabupaten Yalimo', lat: -3.8500, lng: 139.3833, river: 'Sungai Elelim', das: 'DAS Mamberamo' },
      { name: 'Kabupaten Yahukimo', lat: -4.5000, lng: 139.5000, river: 'Sungai Sobger Dekai', das: 'DAS Sobger' },
    ]
  },
  // 38. Papua Barat Daya (6)
  {
    province: 'Papua Barat Daya',
    items: [
      { name: 'Kota Sorong', lat: -0.8667, lng: 131.2500, river: 'Sungai Remu Sorong', das: 'DAS Remu' },
      { name: 'Kabupaten Sorong', lat: -1.0500, lng: 131.4500, river: 'Sungai Warsamson Aimas', das: 'DAS Warsamson' },
      { name: 'Kabupaten Sorong Selatan', lat: -1.5000, lng: 132.0500, river: 'Sungai Teminabuan', das: 'DAS Kaibus' },
      { name: 'Kabupaten Raja Ampat', lat: -0.2333, lng: 130.5167, river: 'Sungai Waisai', das: 'DAS Raja Ampat' },
      { name: 'Kabupaten Tambrauw', lat: -0.6167, lng: 132.4167, river: 'Sungai Sausapor', das: 'DAS Tambrauw' },
      { name: 'Kabupaten Maybrat', lat: -1.3333, lng: 132.4167, river: 'Danau Ayamaru Inflow', das: 'DAS Ayamaru' },
    ]
  }
];

// Count total items
let totalCount = 0;
PROVINCES_DATA.forEach(p => totalCount += p.items.length);
console.log(`Total Kabupaten/Kota across all 38 provinces: ${totalCount}`);

// Generate realistic stations
const statuses = [
  'baku_mutu',
  'baku_mutu',
  'baku_mutu',
  'cemar_ringan',
  'cemar_ringan',
  'cemar_sedang',
  'cemar_berat',
  'tanpa_data'
];

let stationCounter = 1;
const allStations = [];

PROVINCES_DATA.forEach((provObj) => {
  provObj.items.forEach((item, idx) => {
    const isSTA076 = item.name.includes('Sleman');
    const id = isSTA076 ? 'STA-076' : `STA-${String(stationCounter).padStart(3, '0')}`;
    if (!isSTA076) stationCounter++;

    // Determine status
    let status = item.status;
    let ipScore = item.ipScore;
    let isOnline = true;

    if (!status) {
      // Deterministic spread based on char code sum
      const sum = (item.name + provObj.province).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const mod = sum % 100;
      if (mod < 44) {
        status = 'baku_mutu';
        ipScore = Number((0.45 + (mod / 100) * 0.54).toFixed(2));
      } else if (mod < 76) {
        status = 'cemar_ringan';
        ipScore = Number((1.2 + ((mod - 44) / 32) * 3.6).toFixed(2));
      } else if (mod < 90) {
        status = 'cemar_sedang';
        ipScore = Number((5.2 + ((mod - 76) / 14) * 4.4).toFixed(2));
      } else if (mod < 97) {
        status = 'cemar_berat';
        ipScore = Number((10.2 + ((mod - 90) / 7) * 4.8).toFixed(2));
      } else {
        status = 'tanpa_data';
        ipScore = 0.0;
        isOnline = false;
      }
    }

    const stationName = item.stationName || `Stasiun ${item.name.replace('Kabupaten ', '').replace('Kota ', '')} - ${item.river.split(' ')[0]}`;

    // Compute parameters based on status
    let parameters;
    if (status === 'tanpa_data') {
      parameters = { ph: 0.0, do: 0.0, bod: 0.0, cod: 0.0, tss: 0.0, temp: 0.0 };
    } else if (status === 'cemar_berat') {
      parameters = {
        ph: Number((5.6 + (Math.random() * 0.6)).toFixed(1)),
        do: Number((1.5 + (Math.random() * 0.9)).toFixed(1)),
        bod: Number((9.0 + (Math.random() * 3.5)).toFixed(1)),
        cod: Number((42.0 + (Math.random() * 12.0)).toFixed(1)),
        tss: Number((65.0 + (Math.random() * 25.0)).toFixed(1)),
        temp: Number((28.5 + (Math.random() * 2.0)).toFixed(1)),
      };
    } else if (status === 'cemar_sedang') {
      parameters = {
        ph: Number((6.3 + (Math.random() * 0.6)).toFixed(1)),
        do: Number((3.2 + (Math.random() * 1.0)).toFixed(1)),
        bod: Number((5.0 + (Math.random() * 1.8)).toFixed(1)),
        cod: Number((26.0 + (Math.random() * 8.0)).toFixed(1)),
        tss: Number((45.0 + (Math.random() * 14.0)).toFixed(1)),
        temp: Number((27.5 + (Math.random() * 1.5)).toFixed(1)),
      };
    } else if (status === 'cemar_ringan') {
      parameters = {
        ph: Number((6.8 + (Math.random() * 0.5)).toFixed(1)),
        do: Number((4.6 + (Math.random() * 0.8)).toFixed(1)),
        bod: Number((3.0 + (Math.random() * 1.2)).toFixed(1)),
        cod: Number((18.0 + (Math.random() * 6.0)).toFixed(1)),
        tss: Number((28.0 + (Math.random() * 10.0)).toFixed(1)),
        temp: Number((26.8 + (Math.random() * 1.6)).toFixed(1)),
      };
    } else {
      // baku_mutu
      parameters = {
        ph: Number((7.1 + (Math.random() * 0.5)).toFixed(1)),
        do: Number((5.8 + (Math.random() * 1.4)).toFixed(1)),
        bod: Number((1.6 + (Math.random() * 0.9)).toFixed(1)),
        cod: Number((11.0 + (Math.random() * 4.5)).toFixed(1)),
        tss: Number((14.0 + (Math.random() * 8.0)).toFixed(1)),
        temp: Number((25.5 + (Math.random() * 2.2)).toFixed(1)),
      };
    }

    const stationObj = {
      id,
      code: `KLHK-${provObj.province.slice(0, 3).toUpperCase()}-${String(stationCounter).padStart(3, '0')}`,
      name: stationName,
      das: item.das,
      river: item.river,
      province: provObj.province,
      city: item.name,
      ...(item.district ? { district: item.district } : {}),
      ...(item.subdistrict ? { subdistrict: item.subdistrict } : {}),
      lat: item.lat,
      lng: item.lng,
      ...(item.displayLat ? { displayLat: item.displayLat } : {}),
      ...(item.displayLng ? { displayLng: item.displayLng } : {}),
      status,
      ipScore,
      badgeNumber: '999',
      parameters,
      lastUpdate: '28/08/2026 14:02:57',
      isOnline,
    };

    allStations.push(stationObj);
  });
});

// Ensure STA-076 is at the top or properly formatted
const sta076Index = allStations.findIndex(s => s.id === 'STA-076');
if (sta076Index > -1) {
  const [sta076] = allStations.splice(sta076Index, 1);
  allStations.unshift(sta076);
}

// Calculate status counts
const counts = {
  baku_mutu: allStations.filter(s => s.status === 'baku_mutu' || s.status === 'memenuhi_baku_mutu').length,
  cemar_ringan: allStations.filter(s => s.status === 'cemar_ringan').length,
  cemar_sedang: allStations.filter(s => s.status === 'cemar_sedang').length,
  cemar_berat: allStations.filter(s => s.status === 'cemar_berat').length,
  tanpa_data: allStations.filter(s => s.status === 'tanpa_data').length,
};

console.log('Status counts:', counts);

const outputContent = `import { Station, MonitoringMetrics, StatusSummary } from '../types/onlimo';

export const INITIAL_METRICS: MonitoringMetrics = {
  das: '42.210',
  sungai: '70.000',
  stasiun: '${allStations.length}',
  provinsi: '38',
  kabupaten: '514',
};

export const STATUS_SUMMARIES: StatusSummary[] = [
  {
    status: 'baku_mutu',
    label: 'Memenuhi Baku Mutu',
    color: '#22c55e',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    count: '${counts.baku_mutu}',
    description: 'Kualitas air memenuhi baku mutu standar kelas II (IP ≤ 1.0)',
  },
  {
    status: 'cemar_ringan',
    label: 'Cemar Ringan',
    color: '#3b82f6',
    textColor: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    count: '${counts.cemar_ringan}',
    description: 'Kondisi air mengalami cemar ringan (1.0 < IP ≤ 5.0)',
  },
  {
    status: 'cemar_sedang',
    label: 'Cemar Sedang',
    color: '#eab308',
    textColor: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    count: '${counts.cemar_sedang}',
    description: 'Kondisi air tercemar sedang (5.0 < IP ≤ 10.0)',
  },
  {
    status: 'cemar_berat',
    label: 'Cemar Berat',
    color: '#ef4444',
    textColor: 'text-rose-700 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
    count: '${counts.cemar_berat}',
    description: 'Kondisi air tercemar berat (IP > 10.0)',
  },
  {
    status: 'tanpa_data',
    label: 'Tanpa Data',
    color: '#64748b',
    textColor: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-900/40',
    borderColor: 'border-slate-200 dark:border-slate-800',
    count: '${counts.tanpa_data}',
    description: 'Sensor sedang offline atau dalam pemeliharaan berkala',
  },
];

export const MOCK_STATIONS: Station[] = ${JSON.stringify(allStations, null, 2)};
`;

fs.writeFileSync(path.resolve('./src/data/mockStations.ts'), outputContent, 'utf-8');
console.log('Successfully wrote src/data/mockStations.ts with 514 stations!');
