import type { Schema, Struct } from '@strapi/strapi';

export interface DestinationAudienceTag extends Struct.ComponentSchema {
  collectionName: 'components_destination_audience_tags';
  info: {
    description: 'Tipo di viaggiatore a cui la destinazione \u00E8 adatta';
    displayName: 'Audience tag';
  };
  attributes: {
    audience_type: Schema.Attribute.Enumeration<
      ['solo', 'coppia', 'amici', 'famiglia', 'gruppo']
    > &
      Schema.Attribute.Required;
    note: Schema.Attribute.String;
  };
}

export interface DestinationChildrenSuitability extends Struct.ComponentSchema {
  collectionName: 'components_destination_children_suitabilities';
  info: {
    description: "Compatibilit\u00E0 della destinazione con specifiche fasce d'et\u00E0 dei bambini";
    displayName: 'Children suitability';
  };
  attributes: {
    age_band: Schema.Attribute.Enumeration<
      ['age_0_5', 'age_6_12', 'age_13_17']
    > &
      Schema.Attribute.Required;
    note: Schema.Attribute.String;
  };
}

export interface DestinationContact extends Struct.ComponentSchema {
  collectionName: 'components_destination_contacts';
  info: {
    description: 'Contatti e riferimenti ufficiali della destinazione';
    displayName: 'Contact info';
  };
  attributes: {
    booking_url: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    facebook: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    website: Schema.Attribute.String;
  };
}

export interface DestinationInterestMatch extends Struct.ComponentSchema {
  collectionName: 'components_destination_interest_matches';
  info: {
    description: 'Allineamento della destinazione con le categorie di interesse';
    displayName: 'Interest match';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'arte',
        'storia',
        'natura',
        'enogastronomia',
        'shopping_artigianato',
        'esperienze_particolari',
        'nightlife',
      ]
    > &
      Schema.Attribute.Required;
    core_experience: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    strength: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
  };
}

export interface DestinationLocation extends Struct.ComponentSchema {
  collectionName: 'components_destination_locations';
  info: {
    description: 'Informazioni geografiche e indirizzo della destinazione';
    displayName: 'Location';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    area: Schema.Attribute.String;
    latitude: Schema.Attribute.Float & Schema.Attribute.Required;
    longitude: Schema.Attribute.Float & Schema.Attribute.Required;
  };
}

export interface DestinationOpeningSlot extends Struct.ComponentSchema {
  collectionName: 'components_destination_opening_slots';
  info: {
    description: 'Fascia oraria di apertura della destinazione';
    displayName: 'Opening slot';
  };
  attributes: {
    closes_at: Schema.Attribute.Time;
    day_of_week: Schema.Attribute.Enumeration<
      [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]
    > &
      Schema.Attribute.Required;
    note: Schema.Attribute.String;
    opens_at: Schema.Attribute.Time;
  };
}

export interface DestinationTip extends Struct.ComponentSchema {
  collectionName: 'components_destination_tips';
  info: {
    description: 'Suggerimento o informazione pratica per la visita';
    displayName: 'Tip';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface QuestionnaireDietaryPreference extends Struct.ComponentSchema {
  collectionName: 'components_questionnaire_dietary_preferences';
  info: {
    description: 'Restrizioni o preferenze alimentari';
    displayName: 'dietary preference';
  };
  attributes: {
    kind: Schema.Attribute.Enumeration<
      [
        'nessuna',
        'vegetariano',
        'vegano',
        'senza_glutine',
        'senza_lattosio',
        'altro',
      ]
    > &
      Schema.Attribute.Required;
    note: Schema.Attribute.String;
  };
}

export interface QuestionnaireInterestWeight extends Struct.ComponentSchema {
  collectionName: 'components_questionnaire_interest_weights';
  info: {
    description: 'Interesse con peso e priorit\u00E0';
    displayName: 'interest weight';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'arte',
        'storia',
        'natura',
        'enogastronomia',
        'shopping_artigianato',
        'esperienze_particolari',
        'nightlife',
      ]
    > &
      Schema.Attribute.Required;
    must_have: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    weight: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
  };
}

export interface QuestionnaireMobilityOption extends Struct.ComponentSchema {
  collectionName: 'components_questionnaire_mobility_options';
  info: {
    description: 'Modalit\u00E0 di spostamento preferita';
    displayName: 'mobility option';
  };
  attributes: {
    mode: Schema.Attribute.Enumeration<
      ['a_piedi', 'bici', 'mezzi_pubblici', 'auto_taxi', 'mobilita_ridotta']
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'destination.audience-tag': DestinationAudienceTag;
      'destination.children-suitability': DestinationChildrenSuitability;
      'destination.contact': DestinationContact;
      'destination.interest-match': DestinationInterestMatch;
      'destination.location': DestinationLocation;
      'destination.opening-slot': DestinationOpeningSlot;
      'destination.tip': DestinationTip;
      'questionnaire.dietary-preference': QuestionnaireDietaryPreference;
      'questionnaire.interest-weight': QuestionnaireInterestWeight;
      'questionnaire.mobility-option': QuestionnaireMobilityOption;
    }
  }
}
