type ArtCropProps = {
  src: string;
  box: string;
  alt?: string;
  className?: string;
};

export function ArtCrop({ src, box, alt, className }: ArtCropProps) {
  return (
    <svg
      viewBox={box}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      className={className}
    >
      <image href={src} width={1024} height={1024} />
    </svg>
  );
}
