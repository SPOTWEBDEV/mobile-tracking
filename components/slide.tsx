import React, { useRef, useState, useEffect } from "react";
import { View, ScrollView, Image, Dimensions, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

const { width } = Dimensions.get("window");

const images = [
  require("../assets/images/asfast-earn1.png"),
  require("../assets/images/asfast-earn.png"),
];

export default function ImageSlider() {
  // Tell TypeScript this ref is a ScrollView or null
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= images.length) nextIndex = 0;

      if (scrollRef.current) {
        // Scroll to the next image
        scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
      }

      setActiveIndex(nextIndex);
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Handle manual scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onMomentumScrollEnd={handleScroll} // updates dot on manual scroll
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={img}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    borderColor: "#ccc",
  },
  image: {
    width: width - 10,
    height: 160,
    borderRadius:10
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
});
