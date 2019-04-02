def calculateImageLocation(length, cutNum, margin, num):
    imageHeight = margin * num * 2 + 8
    if length < imageHeight * cutNum:
        print(f"长度小于最低要求，问题无解(至少需要{imageHeight * cutNum})")
    else:
        interval = length / cutNum
        begin = (interval / 2) - (imageHeight / 2)
        print(f"起始距离为{begin},间距为{interval}")


if __name__ == '__main__':
    calculateImageLocation(1600, 8, 6, 14)
    # calculateImageLocation(1000,4,1,45)
