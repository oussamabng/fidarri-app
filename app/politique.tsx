import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import i18n from '@/i18n';

const Politique = () => {
    const { t } = useTranslation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: RFValue(25) }}>
                <Text style={styles.headerTitle}>
                    {t("Politique de confidentialité")}
                </Text>
                <Text style={styles.subHeaderTitle}>
                    {t("En utilisant ce site, vous déclarez avoir lu et accepté toutes les conditions suivantes :")}
                </Text>
                <Text style={styles.paragraph}>
                    {t("Nous avons le droit de modifier, d’ajouter ou de supprimer toute clause du présent Contrat à tout moment sans en informer les abonnés, alors veuillez consulter les modalités avant de faire un départ.")}
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        flex: 1,
    },
    headerTitle: {
        fontWeight: '700',
        fontSize: RFValue(18),
        color: '#7C369A',
        marginBottom: RFValue(20),
        textAlign: i18n.language === "ar" ? "right" : "left"
    },
    subHeaderTitle: {
        fontWeight: '500',
        fontSize: RFValue(14),
        marginBottom: RFValue(5),
        textAlign: i18n.language === "ar" ? "right" : "left"
    },
    paragraph: {
        fontSize: RFValue(12),
        textAlign: i18n.language === "ar" ? "right" : "left"
    },
});

export default Politique;
