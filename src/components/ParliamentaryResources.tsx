import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@mui/material';

const resources = [
  {
    title: 'Written questions, answers and statements',
    description: 'Find written questions and answers, as well as written statements',
    href: 'https://questions-statements.parliament.uk/',
    image: 'https://www.parliament.uk/Content/img/illustration-wq.png',
    alt: 'Illustration representing a written question',
  },
  {
    title: 'Statutory Instruments',
    description: 'Find Statutory Instruments by title, paper number, and other criteria',
    href: 'https://statutoryinstruments.parliament.uk',
    image: 'https://www.parliament.uk/Content/img/illustration-si.png',
    alt: 'Illustration representing a Statutory Instrument',
  },
  {
    title: 'Treaties',
    description: 'Find treaties by title, command paper number, and other criteria',
    href: 'https://treaties.parliament.uk',
    image: 'https://www.parliament.uk/Content/img/illustration-treaties.png',
    alt: 'Illustration representing a treaty',
  },
  {
    title: 'Deposited papers',
    description: 'Find deposited papers that have been deposited in both houses',
    href: 'https://depositedpapers.parliament.uk',
    image: 'https://www.parliament.uk/Content/img/illustration-dp.png',
    alt: 'Illustration representing deposited papers',
  },
  {
    title: "MPs' Guide to Procedure",
    description: 'Practical, clearly written guidance on House of Commons procedure for MPs and their staff',
    href: 'https://guidetoprocedure.parliament.uk',
    image: 'https://www.parliament.uk/Content/img/illustration-gtp.png',
    alt: 'Illustration representing MPs next to a book',
  },
  {
    title: 'Erskine May',
    description: 'Browse and search an online version of Erskine May’s treatise on the law, privileges, proceedings',
    href: 'https://erskinemay.parliament.uk',
    image: 'https://www.parliament.uk/Content/img/illustration-erskinemay.png',
    alt: 'Illustration representing the Erskine May book',
  },
];

const ParliamentaryResources: React.FC = () => {
  return (
    <Box sx={{ py: 0, px: 1}}>
      <Typography variant="h4" component="h2" gutterBottom>
        Other Parliamentary resources
      </Typography>

      <Grid container spacing={3}>
        {resources.map((res, index) => (
          <Grid sx={{sm:6, md:6}} key={index}>
            <Card
              sx={{
                height: '100%',
                borderLeft: '5px solid #0D5B2E',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                component="a"
                href={res.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  height: '100%',
                }}
              >
                <CardMedia
                  component="img"
                  image={res.image}
                  alt={res.alt}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'contain',
                    p: 2,
                  }}
                />
                <CardContent sx={{ pt: 2, flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={600} 
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word'
                    }}
                  >
                    {res.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word'
                    }}
                  >
                    {res.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ParliamentaryResources;
