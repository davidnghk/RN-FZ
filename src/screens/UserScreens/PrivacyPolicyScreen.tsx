import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import CustomText from '../../components/Text/CustomText';
import COLOR from '../../constants/Theme/color';
import Card from '../../components/Elements/Card';

const PrivacyPolicyScreen = () => {

    const { t } = useTranslation();
    return (
        <ScrollView style={styles.screen}>

           <Card style={styles.card}>
                <View>
                    <CustomText style={styles.title}>{t('common:privacyPolicy')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:privacyPolicy1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:privacyPolicy2')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:privacyPolicy3')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:privacyPolicy4')}</CustomText>
                </View>
                <View>
                    <CustomText style={styles.title}>{t('common:purposeOfCollectionOfPersonalData')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData2')}</CustomText>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData3')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData4')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData5')}</CustomText>
                        </View>
                        
                    </View>
                    
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData6')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData7')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData8')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData9')}</CustomText>
                        </View>
                        
                    </View>
                    <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData10')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:purposeOfCollectionOfPersonalData11')}</CustomText>

                </View>
                <View>
                    <CustomText style={styles.title}>{t('common:collectionOfPersonalData')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:collectionOfPersonalData1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:collectionOfPersonalData2')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:collectionOfPersonalData3')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:collectionOfPersonalData4')}</CustomText>
                </View>
                <View>
                    <CustomText style={styles.title}>{t('common:disclosureOrTransferOfData')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData2')}</CustomText>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData3')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData4')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData5')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData6')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData7')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData8')}</CustomText>
                        </View>
                        
                    </View>
                    <CustomText style={styles.content}>{t('sentence:disclosureOrTransferOfData9')}</CustomText>
                </View>
                <View>
                    <CustomText style={styles.title}>{t('common:cookiesAndLogFiles')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:cookiesAndLogFiles1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:cookiesAndLogFiles2')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:cookiesAndLogFiles3')}</CustomText>
                </View>

                <View>
                    <CustomText style={styles.title}>{t('common:googleAnalytics')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:googleAnalytics1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:googleAnalytics2')}</CustomText>
                </View>
                <View>
                    <CustomText style={styles.title}>{t('common:linksToOtherWebsitesOrApplications')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:linksToOtherWebsitesOrApplications1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:linksToOtherWebsitesOrApplications2')}</CustomText>
                </View>

                <View>
                    <CustomText style={styles.title}>{t('common:security')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:security1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:security2')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:security3')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:security4')}</CustomText>
                </View>

                <View>
                    <CustomText style={styles.title}>{t('common:accessToOrRequestForCorrectionOfData')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:accessToOrRequestForCorrectionOfData1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:accessToOrRequestForCorrectionOfData2')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:accessToOrRequestForCorrectionOfData3')}</CustomText>
                </View>

                <View>
                    <CustomText style={styles.title}>{t('common:retentionOfPersonalData')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:retentionOfPersonalData1')}</CustomText>
                </View>

                <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers1')}</CustomText>

                <View>
                    <CustomText style={styles.title}>{t('common:rightsApplicableToEuUsers')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers1')}</CustomText>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers2')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers3')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers4')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers5')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers6')}</CustomText>
                        </View>
                        
                    </View>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                        <CustomText>{'\u2022'}</CustomText>
                        </View>
                        <View style={styles.bulletText}>
                            <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers7')}</CustomText>
                        </View>
                        
                    </View>
                    <CustomText style={styles.content}>{t('sentence:rightsApplicableToEuUsers8')}</CustomText>
                    
                </View>

                <View>
                    <CustomText style={styles.title}>{t('common:changesInThisPrivacyPolicy')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:changesInThisPrivacyPolicy1')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:changesInThisPrivacyPolicy2')}</CustomText>

                </View>
                
                <View>
                    <CustomText style={styles.title}>{t('common:inconsistency')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:inconsistency1')}</CustomText>

                </View>

                <View>
                    <CustomText style={styles.title}>{t('common:enquiries')}</CustomText>
                    <CustomText style={styles.content}>{t('sentence:enquiries1')}</CustomText>

                </View>

            </Card>

        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 15,
    },
    title: {
        fontWeight: 'bold',
        marginVertical: 10,
    },
    youtubeContainer: {
        marginTop: 5,
        marginHorizontal: 15,
        // backgroundColor: 'yellow',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        width: '100%',
        textAlign: 'justify',
        marginBottom : 10,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
    },
    bullet: {
        width: 10,
        textAlign: 'left',
        paddingBottom: 10,
    },
    bulletText: {
        flex:1,
    }
});

export default PrivacyPolicyScreen;