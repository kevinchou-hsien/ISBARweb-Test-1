import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: '1',
    title: '外科術後呼吸困難',
    patientName: '王大明',
    bedNumber: '502-1',
    age: 65,
    gender: '男',
    difficulty: 'Level 1',
    ward: '5A 病房',
    timeLimit: 0,
    chiefComplaint: '術後呼吸困難',
    fullStory: `王大明先生，65歲，昨天剛完成右膝人工關節置換術。目前在 5A 病房。
今天早上巡房時，病人突然抱怨胸口悶痛且呼吸非常費力。
生命徵象顯示：呼吸每分鐘 28 次，心跳 110 次，血氧飽和度 (SpO2) 下降至 88%。
過去病史有高血壓與長期抽菸。聽診發現雙肺下葉有細濕囉音。
身為實習護生，你需要立即向學姊或醫師交班。`,
    keywords: [
      { id: 'k1', text: '我是 5A 病房護生小明', category: 'I', description: '自我介紹與單位' },
      { id: 'k2', text: '502-1 床王大明先生', category: 'S', description: '病人姓名與床號' },
      { id: 'k3', text: '目前感到呼吸困難且胸口悶痛', category: 'S', description: '目前發生的主要問題' },
      { id: 'k4', text: '昨天剛完成右膝人工關節置換術', category: 'B', description: '相關手術史' },
      { id: 'k5', text: '過去有高血壓病史', category: 'B', description: '過去病史' },
      { id: 'k6', text: '呼吸每分鐘 28 次', category: 'A', description: '異常生命徵象' },
      { id: 'k7', text: '血氧飽和度 (SpO2) 下降至 88%', category: 'A', description: '異常檢查數值' },
      { id: 'k8', text: '聽診有囉音', category: 'A', description: '身體評估發現' },
      { id: 'k9', text: '建議立即請住院醫師過來評估', category: 'R', description: '具體建議行動', priority: 1 },
      { id: 'k10', text: '先給予氧氣治療', category: 'R', description: '初步處理措施', priority: 2 },
    ]
  },
  {
    id: '1-2',
    title: '術後傷口疼痛管理',
    patientName: '陳阿姨',
    bedNumber: '505-2',
    age: 58,
    gender: '女',
    difficulty: 'Level 1',
    ward: '5A 病房',
    timeLimit: 0,
    chiefComplaint: '腹部術後劇烈疼痛',
    fullStory: `陳阿姨，58歲，今天早上剛完成腹腔鏡膽囊切除術。
目前回到病房 4 小時，主訴傷口劇烈疼痛，疼痛評分 (NRS) 達 8 分。
病人顯得焦躁不安，出冷汗，血壓稍高 145/92 mmHg。
醫囑有開立止痛藥 (Keto) 必要時使用。`,
    keywords: [
      { id: 'k1-2-1', text: '我是 5A 病房護生小明', category: 'I', description: '自我介紹' },
      { id: 'k1-2-2', text: '505-2 床陳阿姨', category: 'S', description: '病人資訊' },
      { id: 'k1-2-3', text: '術後傷口劇烈疼痛，NRS 8 分', category: 'S', description: '目前問題' },
      { id: 'k1-2-4', text: '早上剛完成腹腔鏡膽囊切除術', category: 'B', description: '手術背景' },
      { id: 'k1-2-5', text: '血壓 145/92 mmHg，顯得焦躁', category: 'A', description: '評估發現' },
      { id: 'k1-2-6', text: '建議依醫囑給予止痛藥物', category: 'R', description: '建議處置', priority: 1 },
      { id: 'k1-2-7', text: '協助病人採舒適臥位', category: 'R', description: '護理措施', priority: 2 },
    ]
  },
  {
    id: '2',
    title: '內科心衰竭惡化',
    patientName: '李美玲',
    bedNumber: '508-2',
    age: 42,
    gender: '女',
    difficulty: 'Level 2',
    ward: '5A 病房',
    timeLimit: 180,
    chiefComplaint: '心衰竭合併下肢水腫',
    fullStory: `李美玲女士，42歲，因心衰竭急性惡化入院。
目前主訴呼吸喘，無法平躺，下肢有明顯凹陷性水腫 (Pitting edema 2+)。
病人三年前曾有一次感冒紀錄，且信仰佛教。
生命徵象：血壓 150/90 mmHg，心跳 95 次，呼吸 24 次。
目前留置有 CVP 管路，壓力測得 18 cmH2O。
醫師開立了利尿劑 (Lasix) 醫囑，並要求記錄 I/O。`,
    keywords: [
      { id: 'k11', text: '我是 5A 病房護生小玲', category: 'I', description: '自我介紹' },
      { id: 'k12', text: '508-2 床李美玲女士', category: 'S', description: '病人資訊' },
      { id: 'k13', text: '心衰竭急性惡化，呼吸喘且水腫', category: 'S', description: '當前狀況' },
      { id: 'k14', text: 'CVP 壓力 18 cmH2O', category: 'A', description: '管路監測' },
      { id: 'k15', text: '下肢 Pitting edema 2+', category: 'A', description: '身體評估' },
      { id: 'k16', text: '三年前曾有感冒紀錄', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k17', text: '病人信仰佛教', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k18', text: '給予利尿劑 Lasix', category: 'R', description: '治療計畫', priority: 2 },
      { id: 'k19', text: '嚴格記錄 I/O 與體重', category: 'R', description: '護理重點', priority: 1 },
      { id: 'k20', text: '採半坐臥位 (Semi-Fowler)', category: 'R', description: '護理處置', priority: 3 },
    ]
  },
  {
    id: '2-2',
    title: '糖尿病酮酸中毒 (DKA)',
    patientName: '林同學',
    bedNumber: '510-1',
    age: 19,
    gender: '男',
    difficulty: 'Level 2',
    ward: '5A 病房',
    timeLimit: 180,
    chiefComplaint: '意識模糊、呼吸有甜味',
    fullStory: `林同學，19歲，第一型糖尿病患者。
因意識模糊、噁心嘔吐被送入病房。呼吸深快 (Kussmaul respiration) 且帶有水果甜味。
病人昨天剛買了一雙新球鞋，且平時喜歡看動漫。
血糖值 (Sugar) 顯示為 550 mg/dL，尿酮 (Urine Ketone) 強陽性。
目前血壓 100/60 mmHg，皮膚乾燥。`,
    keywords: [
      { id: 'k2-2-1', text: '我是 5A 病房護生小玲', category: 'I', description: '自我介紹' },
      { id: 'k2-2-2', text: '510-1 床林同學', category: 'S', description: '病人資訊' },
      { id: 'k2-2-3', text: '疑似 DKA，意識模糊且呼吸有甜味', category: 'S', description: '目前問題' },
      { id: 'k2-2-4', text: '第一型糖尿病患者', category: 'B', description: '病史' },
      { id: 'k2-2-5', text: '血糖 550 mg/dL，尿酮強陽性', category: 'A', description: '檢驗結果' },
      { id: 'k2-2-6', text: '昨天買了新球鞋', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k2-2-7', text: '平時喜歡看動漫', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k2-2-8', text: '建議立即給予大量生理食鹽水灌注', category: 'R', description: '處置', priority: 1 },
      { id: 'k2-2-9', text: '準備靜脈注射胰島素 (RI)', category: 'R', description: '處置', priority: 2 },
    ]
  },
  {
    id: '3',
    title: '重症敗血性休克',
    patientName: '張老先生',
    bedNumber: 'SICU-05',
    age: 72,
    gender: '男',
    difficulty: 'Level 3',
    ward: 'SICU',
    timeLimit: 120,
    chiefComplaint: '敗血性休克併多重器官衰竭',
    fullStory: `張老先生，72歲，因腹膜炎引發敗血性休克轉入 SICU。
目前插管 (Endo) 使用呼吸器中，設定為 PC mode。
留置有 A-line, CVP, 以及三腔導尿管.
今日早上血壓掉至 80/45 mmHg，MAP 56 mmHg。
家屬非常焦慮，一直詢問病人什麼時候可以轉出加護病房。
病人十年前曾做過白內障手術。
目前使用 Levophed 15 mcg/min 維持血壓。
WBC 25,000/uL，Lactate 4.5 mmol/L。`,
    keywords: [
      { id: 'k21', text: '我是 SICU 護生阿強', category: 'I', description: '自我介紹' },
      { id: 'k22', text: 'SICU-05 床張老先生', category: 'S', description: '病人資訊' },
      { id: 'k23', text: '敗血性休克，血壓掉至 80/45 mmHg', category: 'S', description: '主訴' },
      { id: 'k24', text: 'Endo, A-line, CVP 留置中', category: 'B', description: '管路背景' },
      { id: 'k25', text: 'MAP 56 mmHg, Lactate 4.5', category: 'A', description: '血流動力學' },
      { id: 'k26', text: '家屬詢問轉出時間', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k27', text: '十年前白內障手術', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k28', text: '調高 Levophed 劑量', category: 'R', description: '急迫處置', priority: 1 },
      { id: 'k29', text: '追蹤血液培養與抗生素使用', category: 'R', description: '治療計畫', priority: 2 },
      { id: 'k30', text: '準備輸液復甦 (Fluid resuscitation)', category: 'R', description: '護理重點', priority: 3 },
    ]
  },
  {
    id: '3-2',
    title: '急性心肌梗塞 (AMI)',
    patientName: '郭先生',
    bedNumber: 'CCU-02',
    age: 55,
    gender: '男',
    difficulty: 'Level 3',
    ward: 'CCU',
    timeLimit: 120,
    chiefComplaint: '劇烈胸痛、冷汗、血壓下降',
    fullStory: `郭先生，55歲，因胸悶痛放射至左肩入院。
EKG 顯示 ST 段上升 (STEMI)，目前在 CCU 監測。
突然病人主訴疼痛加劇，血壓掉至 85/50 mmHg，心率 115 次。
病人曾提到他很擔心家裡的貓沒人餵，且他以前是個工程師。
聽診發現心音遙遠，疑似心因性休克。
醫囑已開立緊急心導管 (PCI) 準備。`,
    keywords: [
      { id: 'k3-2-1', text: '我是 CCU 護生阿強', category: 'I', description: '自我介紹' },
      { id: 'k3-2-2', text: 'CCU-02 床郭先生', category: 'S', description: '病人資訊' },
      { id: 'k3-2-3', text: 'STEMI 惡化，疑似心因性休克', category: 'S', description: '目前問題' },
      { id: 'k3-2-4', text: '血壓 85/50 mmHg，心率 115 次', category: 'A', description: '生命徵象' },
      { id: 'k3-2-5', text: 'EKG 顯示 ST 段上升', category: 'A', description: '檢查結果' },
      { id: 'k3-2-6', text: '擔心家裡的貓', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k3-2-7', text: '以前是工程師', category: 'NOISE', description: '無關資訊', isNoise: true },
      { id: 'k3-2-8', text: '立即啟動緊急心導管 (PCI) 流程', category: 'R', description: '處置', priority: 1 },
      { id: 'k3-2-9', text: '準備強心劑 (Dopamine/Dobutamine)', category: 'R', description: '處置', priority: 2 },
      { id: 'k3-2-10', text: '保持絕對臥床並給予高流量氧氣', category: 'R', description: '處置', priority: 3 },
    ]
  }
];
