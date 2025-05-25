import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image  } from '@react-pdf/renderer';
import type { Contract, Application } from '../types/database';

Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.otf'
});
// フォームデータの型定義（ApplyPage.tsx と一致させる必要があります）
interface FormData {
  company_name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  sub_area: string;
  building_room: string;
  representative_name: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  initial_fee: string;
  monthly_fee: string;
  excess_fee: string;
  option_fee: string;
  payment_method: string;
  notes: string;
  signed_in_email: string; // サインイン時のメールアドレス
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    padding: 30,
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 12,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
  },
  text: {
    lineHeight: 1.5,
    marginBottom: 3,
  },
  table: {
    // display: 'table',
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 25,
    alignItems: 'center',
  },
  tableCol: {
    width: '50%',
    padding: 5,
  },
  applicationForm: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
  },
  formSection: {
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formField: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  formLabel: {
    width: '30%',
  },
  formValue: {
    width: '70%',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    paddingBottom: 2,
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    minHeight: 100,
  },
  signatureImage: {
    marginTop: 6,
    width: 120,
    height: 50,   // お好みで
    objectFit: 'contain',
  },
});

interface ContractPDFProps {
  // contract: Contract;
  application: Application | FormData;
}

const ContractPDF: React.FC<ContractPDFProps> = ({ application }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>AquaTutorAI サービス利用契約書</Text>

        <View style={styles.section}>
          <Text style={styles.text}>
            本契約は、アクア・プラン株式会社（以下「甲」という）と、契約締結書に記載の法人（以下「乙」という）との間で、
            甲が提供する営業研修支援AIサービス「AquaTutorAI」（以下「本サービス」という）の利用に関して、以下の通り締結される。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>第1条（目的）</Text>
          <Text style={styles.text}>
            本契約は、甲が提供する本サービスについて、乙がこれを利用する際の権利義務を定めることを目的とする。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>第2条（サービス内容）</Text>
          <Text style={styles.text}>
            1. 本サービスは、営業研修に特化した対話型AIによるEラーニング支援システムである。
          </Text>
          <Text style={styles.text}>
            2. 甲は乙に対して以下の機能・支援を提供する：
          </Text>
          <Text style={styles.text}>
            (1) 対話型AIによる営業ロールプレイ支援
          </Text>
          <Text style={styles.text}>
            (2) フィードバック機能
          </Text>
          <Text style={styles.text}>
            (3) スプレッドシート連携による進捗管理
          </Text>
          <Text style={styles.text}>
            (4) 多言語対応（必要に応じて）
          </Text>
          <Text style={styles.text}>
            (5) 初期導入サポートおよび運用ガイド
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>第3条（契約期間）</Text>
          <Text style={styles.text}>
            1. 本契約の有効期間は、契約締結日より1年間とする。
          </Text>
          <Text style={styles.text}>
            2. 有効期間満了の1ヶ月前までに、いずれか当事者から書面で解約の意思表示がない限り、本契約は同一条件で1年間自動更新されるものとする。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>第4条（利用料金および支払方法）</Text>
          <Text style={styles.text}>
            1. 乙は以下の料金を甲に支払うものとする：
          </Text>
          <Text style={styles.text}>
            契約金額：{Number(application.initial_fee) + Number(application.monthly_fee) * 12 + Number(application.option_fee)}円（税別）
          </Text>
          <Text style={styles.text}>
            2. 支払いは原則として12ヶ月分一括前払いとする。IT導入補助金を使用しない場合はこの限りではない。
          </Text>
        </View>

        <View style={styles.applicationForm}>
          <Text style={styles.formTitle}>【AquaTutorAI 申込書兼利用規約】</Text>
          
          <View style={styles.formSection}>
            <Text style={styles.heading}>1. 申込者（法人情報）</Text>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>法人名：</Text>
              <Text style={styles.formValue}>{application.company_name}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>所在地：</Text>
              <Text style={styles.formValue}>
                {'company_address' in application
                  ? application.company_address
                  : `${application.prefecture}${application.city}${application.sub_area}${application.building_room}`}
              </Text>
          </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>代表者名：</Text>
              <Text style={styles.formValue}>{application.representative_name}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>連絡先：</Text>
              <Text style={styles.formValue}>
                {'contact_phone' in application
                  ? application.contact_phone
                  : application.phone_number}
              </Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>メール：</Text>
              <Text style={styles.formValue}>
                {'email' in application
                  ? application.email
                  : application.contact_email}
              </Text>
            </View>
          </View>

          {/* <View style={styles.formSection}>
            <Text style={styles.heading}>2. 研修項目</Text>
            {contract.training_items.map((item, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {item}
              </Text>
            ))}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.heading}>3. マニュアル数</Text>
            <Text style={styles.text}>{contract.manual_count}冊</Text>
          </View>

          {contract.special_notes && (
            <View style={styles.formSection}>
              <Text style={styles.heading}>4. 特記事項</Text>
              <Text style={styles.text}>{contract.special_notes}</Text>
            </View>
          )} */}
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.text}>甲：</Text>
            <Text style={styles.text}>アクア・プラン株式会社</Text>
            <Text style={styles.text}>大阪府大阪市淀川区西中島3丁目8番2号</Text>
            <Text style={styles.text}>新大阪KGビル3階</Text>
            <Text style={styles.text}>代表取締役　北山 喜一</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.text}>乙：</Text>
            <Text style={styles.text}>{application.company_name}</Text>
            <Text style={styles.text}>               
              {'company_address' in application
                  ? application.company_address
                  : `${application.prefecture}${application.city}${application.sub_area}${application.building_room}`}
            </Text>
            <Text style={styles.text}>{application.representative_name}</Text>
            <Text style={styles.text}>{year}年{month}月{day}日</Text>
            {/* 署名画像（Application 型に sign_name がある場合だけ表示） */}
            {'sign_name' in application && application.sign_name && (
              <Image
                src={application.sign_name}   // data:image/png;base64,…
                style={styles.signatureImage}
              />
            )}

          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ContractPDF;