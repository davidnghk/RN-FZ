import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, ScrollView} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import CustomText from '../../components/Text/CustomText';
import COLOR from '../../constants/Theme/color';

const VideoGuideScreen = () => {
  const {t} = useTranslation();

  const VideoList = [
    {
      title: 'introduction',
      videoId: 'xpvJJAWGCDA',
    },
    {
      title: 'overview',
      videoId: 'r-wtq0-9LwQ',
    },
    {
      title: 'alarmNoti',
      videoId: '8eOLOToTZXU',
    },
    {
      title: 'filing',
      videoId: 'iyZLoR7um3M',
    },
  ];

  const VideoItem = (props: {title: string; videoId: string}) => {
    return (
      <View style={styles.youtubeContainer}>
        <CustomText style={styles.title}>
          {t(`video:${props.title}`)}
        </CustomText>
        <YoutubePlayer height={220} play={false} videoId={props.videoId} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.screen}>
      {VideoList.map(video => {
        return (
          <VideoItem
            title={video.title}
            videoId={video.videoId}
            key={video.title}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLOR.bgColor,
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
});

export default VideoGuideScreen;
